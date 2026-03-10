<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update the user's profile picture.
     */
    public function updateProfilePicture(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ], [
            'profile_picture.required' => 'Foto profil wajib dipilih.',
            'profile_picture.image' => 'File yang dipilih bukan gambar yang valid.',
            'profile_picture.mimes' => 'Format foto harus berupa: JPEG, PNG, JPG, atau GIF.',
            'profile_picture.max' => 'Ukuran foto maksimal 2MB. Silakan pilih foto yang lebih kecil.',
        ]);

        try {
            $user = $request->user();

            // Delete old profile picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Store new profile picture
            $path = $request
                ->file('profile_picture')
                ->store('profile-pictures', 'public');

            $user->profile_picture = $path;
            $user->save();

            return Redirect::route('profile.edit')->with(
                'status',
                'Foto profil berhasil diperbarui.',
            );
        } catch (\Exception $e) {
            return Redirect::route('profile.edit')->withErrors([
                'profile_picture' => 'Gagal mengunggah foto profil. Silakan coba lagi.',
            ]);
        }
    }

    /**
     * Delete the user's profile picture.
     */
    public function deleteProfilePicture(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->profile_picture = null;
            $user->save();
        }

        return Redirect::route('profile.edit')->with(
            'status',
            'Foto profil berhasil dihapus.',
        );
    }
}
