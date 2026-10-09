import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      borderClass: 'border-green-500',
      icon: <CheckCircle className="h-6 w-6 text-green-500" />
    },
    error: {
      borderClass: 'border-red-500',
      icon: <AlertCircle className="h-6 w-6 text-red-500" />
    },
    info: {
      borderClass: 'border-blue-500',
      icon: <Info className="h-6 w-6 text-blue-500" />
    }
  };

  const { borderClass, icon } = styles[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-80 bg-white shadow-lg rounded-lg border-l-4 ${borderClass} animate-[slideUp_0.3s_ease-out]`}>
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
