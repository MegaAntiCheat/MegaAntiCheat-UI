interface ToSModalProps {
  isUnsetting?: boolean;
}

export default function ToSModal({ isUnsetting }: ToSModalProps) {
  return (
    <div>
      Terms of Service <div>{isUnsetting?.toString()}</div>
    </div>
  );
}
