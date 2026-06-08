import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

interface ClearCacheModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearCacheModal = ({ visible, onClose, onConfirm }: ClearCacheModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    > 
      <Pressable style={styles.backdrop} onPress={onClose}>
         
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Clear Cache?</Text>
          <Text style={styles.description}>
            This action will permanently delete all your bookmarks. This process cannot be undone.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={() => {
                onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Pressable>
    </Modal>
  );
};

export default ClearCacheModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#A0A0A0',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    backgroundColor: '#FF3B30', 
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

