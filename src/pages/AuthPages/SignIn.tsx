import PageMeta from "../../components/common/PageMeta";

import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Vikosha | Sign In"
        description="Vikosha Tuition App Sign In Page"
      />
      <SignInForm />
      {/* <AuthLayout>
       
      </AuthLayout> */}
    </>
  );
}
