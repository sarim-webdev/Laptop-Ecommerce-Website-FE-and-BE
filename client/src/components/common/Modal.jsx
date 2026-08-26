import { useEffect } from "react";
import PropTypes from "prop-types";

/* =========================================
   MODAL COMPONENT
========================================= */

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlay = true,
}) => {
  /* =========================================
     ESC KEY HANDLER
  ========================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  /* =========================================
     BODY SCROLL LOCK
  ========================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  /* =========================================
     MODAL SIZE
  ========================================= */

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  /* =========================================
     HIDDEN
  ========================================= */

  if (!isOpen) {
    return null;
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={`
          ${sizes[size]}
          relative
          w-full
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title ? "modal-title" : undefined
        }
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* =========================================
            HEADER
        ========================================= */}

        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            {title ? (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            ) : (
              <span />
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
          </div>
        )}

        {/* =========================================
            CONTENT
        ========================================= */}

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================
   PROP TYPES
========================================= */

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf([
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
  ]),
  showCloseButton: PropTypes.bool,
  closeOnOverlay: PropTypes.bool,
};

export default Modal;