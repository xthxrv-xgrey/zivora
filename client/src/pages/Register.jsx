import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  extractApiErrorMessage,
} from "../utils/validators";
import { Field } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { AuthPanel } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form);
      toast.success("Account created.");
      navigate("/");
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
      <AuthPanel
        eyebrow="Join Zivora"
        title={
          <>
            Start the
            <br />
            catalogue<span className="text-clay">.</span>
          </>
        }
        copy="Create an account to add pieces, keep them current, and retire what no longer belongs."
      />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="h-display text-3xl lg:hidden">Create account</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8 lg:mt-0">
            <Field
              label="Name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Field
              label="Confirm password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              {submitting ? "Creating account" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-stone-500">
            Already have an account?{" "}
            <Link to="/login" className="link-underline font-medium text-charcoal">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
