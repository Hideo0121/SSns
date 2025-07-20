<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
            'password' => 'sometimes|string|min:8',
            'user_code' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('users')->ignore($userId)
            ],
            'role' => 'sometimes|required|in:admin,staff,user',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => '名前は必須です',
            'name.max' => '名前は255文字以内で入力してください',
            'email.required' => 'メールアドレスは必須です',
            'email.email' => '有効なメールアドレスを入力してください',
            'email.unique' => 'このメールアドレスは既に使用されています',
            'password.min' => 'パスワードは8文字以上で入力してください',
            'user_code.required' => 'ユーザーコードは必須です',
            'user_code.unique' => 'このユーザーコードは既に使用されています',
            'role.required' => '権限は必須です',
            'role.in' => '無効な権限が指定されています',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'バリデーションエラーが発生しました',
                'errors' => $validator->errors(),
                'error_code' => 'VALIDATION_ERROR'
            ], 422)
        );
    }

    /**
     * Handle a failed authorization attempt.
     *
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'この操作を実行する権限がありません',
                'error_code' => 'FORBIDDEN'
            ], 403)
        );
    }
}
