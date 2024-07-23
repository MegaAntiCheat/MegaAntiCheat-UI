interface ToSModalProps {
  isUnsetting?: boolean;
}

export default function ToSModal({ isUnsetting = false }: ToSModalProps) {
  return (
    <div>
      Terms of Service <div>{isUnsetting?.toString()}</div>
    </div>
  );
}
