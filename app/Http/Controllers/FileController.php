<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    /**
     * Display an avatar image
     */
    public function showAvatar($filename)
    {
        $path = 'avatars/' . $filename;
        
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }
        
        $file = Storage::disk('public')->get($path);
        $mimeType = Storage::disk('public')->mimeType($path);
        
        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
