import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { validateEmail, validatePassword, extractApiErrorMessage } from "../utils/validators";
import { Field } from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
      <AuthPanel
        eyebrow="Welcome back"
        title={
          <>
            Good to
            <br />
            see you<span className="text-clay">.</span>
          </>
        }
        copy="Sign in to manage your pieces — add new work to the catalogue, or make changes to what's already there."
      />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="h-display text-3xl lg:hidden">Sign in</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8 lg:mt-0">
            <Field
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              {submitting ? "Signing in" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-stone-500">
            New to Zivora?{" "}
            <Link to="/register" className="link-underline font-medium text-charcoal">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthPanel({ eyebrow, title, copy }) {
  return (
    <div className="relative hidden overflow-hidden bg-charcoal px-16 py-16 text-ivory lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-clay/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-ivory/[0.04] blur-3xl"
      />

      <p className="font-display text-xl tracking-tightest">ZIVORA</p>

      <div className="relative">
        <p className="eyebrow mb-6 text-ivory/50">{eyebrow}</p>
        <h1 className="h-display text-6xl text-ivory">{title}</h1>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ivory/60">{copy}</p>
      </div>

      <p className="text-xs uppercase tracking-widest2 text-ivory/40">
        Considered objects, well made.
      </p>
    </div>
  );
}
