<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_user_can_upload_profile_picture(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this
            ->actingAs($user)
            ->post('/profile/picture', [
                'profile_picture' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertNotNull($user->profile_picture);
        $this->assertTrue(Storage::disk('public')->exists($user->profile_picture));
        $this->assertNotNull($user->profile_picture_url);
    }

    public function test_uploading_new_profile_picture_deletes_old_file(): void
    {
        Storage::fake('public');

        $oldFile = UploadedFile::fake()->image('old-avatar.jpg')->store('profile-pictures', 'public');

        $user = User::factory()->create([
            'profile_picture' => $oldFile,
        ]);

        $newFile = UploadedFile::fake()->image('new-avatar.jpg');

        $this->actingAs($user)->post('/profile/picture', [
            'profile_picture' => $newFile,
        ])->assertRedirect('/profile');

        $user->refresh();

        $this->assertFalse(Storage::disk('public')->exists($oldFile));
        $this->assertTrue(Storage::disk('public')->exists($user->profile_picture));
    }

    public function test_profile_picture_must_be_an_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->post('/profile/picture', [
                'profile_picture' => $file,
            ]);

        $response
            ->assertSessionHasErrors('profile_picture')
            ->assertRedirect('/profile');

        $this->assertNull($user->fresh()->profile_picture);
    }
}
