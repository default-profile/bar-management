<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	interface Props {
		title: string;
		onSuccess?: () => void;
		onError?: (error: { error: { message: string } }) => void;
	}

	const { title }: Props = $props();

	let { email, otp, isOtpSent } = $state({ email: '', otp: '', isOtpSent: false });
	async function sendOtp(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.emailOtp.sendVerificationOtp({ email: email, type: 'sign-in' });
		if (error) alert(error.message);
		else isOtpSent = true;
	}

	async function loginWithOtp(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.signIn.emailOtp({ email: email, otp: otp });
		if (error) alert(error.message);
		else goto('/');
	}
</script>

<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
	<form class="card-body" onsubmit={isOtpSent ? loginWithOtp : sendOtp}>
		<div class="text-2xl">{title}</div>
		<fieldset class="fieldset">
			<label for="email" class="fieldset-label">Email</label>
			<input id="email" type="email" class="input" placeholder="Email" disabled={isOtpSent} bind:value={email} />
			<label for="otp" class="fieldset-label" hidden={!isOtpSent}>OTP</label>
			<input id="otp" type="text" class="input" placeholder="OTP" hidden={!isOtpSent} bind:value={otp} />
			<button class="btn mt-4 btn-neutral">{isOtpSent ? 'Login' : 'Send OTP'}</button>
		</fieldset>
	</form>
</div>
