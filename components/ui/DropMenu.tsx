import React, { createContext, useContext, useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface LayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropMenuContextProps {
  visible: boolean;
  openMenu: (layout: LayoutRect) => void;
  closeMenu: () => void;
  triggerLayout: LayoutRect | null;
}

const DropMenuContext = createContext<DropMenuContextProps | undefined>(undefined);

export const DropMenu = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRect | null>(null);

  const openMenu = (layout: LayoutRect) => {
    setTriggerLayout(layout);
    setVisible(true);
  };
  const closeMenu = () => setVisible(false);

  return (
    <DropMenuContext.Provider value={{ visible, openMenu, closeMenu, triggerLayout }}>
      {children}
    </DropMenuContext.Provider>
  );
};

const Trigger = ({ children, style }: { children: React.ReactElement; style?: any }) => {
  const context = useContext(DropMenuContext);
  const viewRef = useRef<View>(null);

  if (!context) throw new Error('DropMenu.Trigger must be inside a DropMenu provider');

  const handlePress = () => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      context.openMenu({ x, y, width, height });
    });
  };

  return (
    <View ref={viewRef} style={style} collapsable={false}>
      <Pressable onPress={handlePress}>{children}</Pressable>
    </View>
  );
};

const Content = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DropMenuContext);
  if (!context || !context.visible || !context.triggerLayout) return null;

  const { triggerLayout, closeMenu } = context;

  // Render position algorithm: cleanly floats standard options directly above the bottom row buttons
  const dropdownHeight = 160; 
  const menuTop = triggerLayout.y - dropdownHeight - 10;
  const menuLeft = triggerLayout.x - 50;

  return (
    <Modal visible={context.visible} transparent animationType="fade" onRequestClose={closeMenu}>
      <Pressable style={styles.backdrop} onPress={closeMenu}>
        <View style={[styles.menuContent, { top: menuTop, left: Math.max(16, menuLeft) }]}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

interface ItemProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

const Item = ({ label, onPress, icon }: ItemProps) => {
  const context = useContext(DropMenuContext);
  
  const handleItemPress = () => {
    onPress();
    context?.closeMenu();
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handleItemPress} activeOpacity={0.7}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
};

const Divider = () => <View style={styles.divider} />;

// Compound Component Property Assignments
DropMenu.Trigger = Trigger;
DropMenu.Content = Content;
DropMenu.Header = Header;
DropMenu.Item = Item;
DropMenu.Divider = Divider;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContent: {
    position: 'absolute',
    width: 170,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerText: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
  },
});