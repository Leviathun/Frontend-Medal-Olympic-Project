<script setup lang="ts">
import { ref } from 'vue';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'vee-validate';
import { useMessageStore } from '@/stores/message';
import { useRouter } from 'vue-router';

const messageStore = useMessageStore();
const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);

// Yup schema
const validationSchema = () =>
  yup.object({
    email: isLogin.value
      ? yup.string().notRequired()
      : yup.string().required('Email is required').email('Invalid email'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: isLogin.value
      ? yup.string().notRequired()
      : yup
          .string()
          .oneOf([yup.ref('password')], 'Passwords must match')
          .required('Confirm password is required'),
  });

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  },
});

// Define form fields
const [email] = defineField('email');
const [username] = defineField('username');
const [password] = defineField('password');
const [confirmPassword] = defineField('confirmPassword');

// Submit handler
const onSubmit = handleSubmit((values) => {
  console.log('Form Values:', values);

  if (isLogin.value) {
    authStore
      .login(values.username, values.password)
      .then(() => {
        console.log("✅ Login success, redirecting...");
        router.push({
          name: 'medal-list-view',
          query: { page: '1', pageSize: '10' }
        });
      })
      .catch(() => {
        messageStore.updateMessage('Could not login');
        setTimeout(() => messageStore.resetMessage(), 3000);
      });
  } else {
    authStore
      .register({
        email: values.email,
        username: values.username,
        password: values.password,
      })
      .then(() => {
        messageStore.updateMessage('Account created! Please log in.');
        setTimeout(() => messageStore.resetMessage(), 3000);
        toggleLogin();
      })
      .catch(() => {
        messageStore.updateMessage('Could not register');
        setTimeout(() => messageStore.resetMessage(), 3000);
      });
  }
});


// Toggle login/register
const toggleLogin = () => {
  isLogin.value = !isLogin.value;
  resetForm();
};
</script>

<template>
  <div class="min-h-screen bg-[#252A34] flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-4 text-[#08D9D6]">
        {{ isLogin ? 'Welcome Back!' : 'Create Your Account' }}
      </h2>
      <p class="text-center text-black mb-12">
        {{
          isLogin
            ? 'Enter your credentials to log in.'
            : 'Enter your details to register an account.'
        }}
      </p>

      <!-- Registration/Login Form -->
      <form @submit.prevent="onSubmit">
        <div class="space-y-4">
          <!-- Email Field (Register only) -->
          <div v-if="!isLogin" class="form-group">
            <label
              for="email"
              class="block text-sm text-start font-medium mb-2 text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              v-model="email"
              :error="errors['email']"
              class="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#08D9D6]"
              placeholder="Enter Email"
            />
          </div>

          <!-- Username Field -->
          <div class="form-group">
            <label
              for="username"
              class="block text-sm text-start font-medium mb-2 text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              v-model="username"
              :error="errors['username']"
              class="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#08D9D6]"
              placeholder="Enter your username"
            />
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label
              for="password"
              class="block text-sm text-start font-medium mb-2 text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              v-model="password"
              :error="errors['password']"
              class="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#08D9D6]"
              placeholder="Enter your password"
            />
          </div>

          <!-- Confirm Password Field (Register only) -->
          <div v-if="!isLogin" class="form-group">
            <label
              for="confirm-password"
              class="block text-sm text-start font-medium mb-2 text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              :error="errors['confirmPassword']"
              class="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#08D9D6]"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-12 space-y-2">
          <button
            type="submit"
            class="w-full bg-[#FF2E63] text-white font-semibold py-2 rounded-md hover:bg-[#FF4B7E] transition"
          >
            {{ isLogin ? 'Log In' : 'Register' }}
          </button>

          <!-- Toggle Between Login and Registration -->
          <div class="text-center text-sm mt-4">
            <p class="text-gray-400">
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              <button
                @click="toggleLogin"
                type="button"
                class="text-[#FF4B7E] hover:underline font-medium ml-1"
              >
                {{ isLogin ? 'Sign Up' : 'Log In' }}
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
