import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { getFeatureImages } from "@/store/common-slice";
import { toast } from "sonner";

function ContactUs() {
  const dispatch = useDispatch();
  const { contactUsImageList } = useSelector((state) => state.common);
  const image = contactUsImageList?.[0]?.image;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    dispatch(getFeatureImages("contact-us"));
  }, [dispatch]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill in all fields");
    }
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  }

  return (
    <div>
      <div className="border-b border-ink/10 bg-sand/40 py-16 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-wine">Get in Touch</p>
        <h1 className="font-display text-4xl italic text-ink">Contact Us</h1>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {image && (
          <img
            src={image}
            alt="Contact E-Kart"
            className="mb-12 h-64 w-full rounded-md object-cover"
          />
        )}

        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ink">We'd love to hear from you</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Questions about an order, sizing, or anything else — reach out and our team will
              get back to you within 24 hours.
            </p>

            <div className="mt-8 space-y-4 text-sm text-ink/70">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-wine" />
                support@ekart.com
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-wine" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-wine" />
                123 Fashion Street, New Delhi, India
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
