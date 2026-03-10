<?php

namespace App\Policies;

use App\Models\ReportArchive;
use App\Models\User;

class ReportArchivePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ReportArchive $reportArchive): bool
    {
        return $user->id === $reportArchive->user_id;
    }

    public function delete(User $user, ReportArchive $reportArchive): bool
    {
        return $user->id === $reportArchive->user_id;
    }
}
