import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md mx-auto px-6"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <div>
          <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-surface-800 mb-2">Page Not Found</h2>
          <p className="text-surface-600">
            Looks like this file got lost in the upload queue. Let's get you back to the main uploader.
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Back to DropZone
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;