import Image from "next/image";

type Props = {
  defaultOpen?: boolean;
  compact?: boolean;
};

export function RegisterCard({ compact = false }: Props) {
  return (
    <div className={`register-card ${compact ? "is-compact" : ""}`} id="register">
      <div className="register-card-head">
        <div className="register-card-icon" aria-hidden>
          <Image
            src="/mama-akingbade.jpg"
            alt=""
            width={44}
            height={44}
            className="register-card-photo"
          />
        </div>
        <div className="register-card-titles">
          <h3>Registration</h3>
          <p>GUEST ACCOMMODATION</p>
        </div>
      </div>

      <div className="register-closed-notice" role="status">
        <p className="register-closed-title">Registration is no longer available</p>
        <p className="register-closed-lead">
          New accommodation requests are closed. The rest of this memorial site
          remains open. For questions, please use the contact details below.
        </p>
      </div>
    </div>
  );
}
