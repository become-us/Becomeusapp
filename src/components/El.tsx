import React from 'react';
import { useEditStore, ElementStyle } from '@/lib/editStore';

interface ElProps {
  id: string;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: unknown;
}

export function El({ id, as: Tag = 'div', children, style, className, onClick, ...rest }: ElProps) {
  const { editMode, selectedId, selectEl, styles } = useEditStore();
  const elStyle = (styles[id] || {}) as React.CSSProperties;
  const merged: React.CSSProperties = { ...elStyle, ...style };
  const isSelected = editMode && selectedId === id;

  if (!editMode) {
    const T = Tag as React.ElementType;
    return <T style={merged} className={className} onClick={onClick} {...rest}>{children}</T>;
  }

  const T = Tag as React.ElementType;
  return (
    <T
      style={{
        ...merged,
        outline: isSelected ? '2px solid #7A90B5' : '1px dashed rgba(122,144,181,0.5)',
        outlineOffset: '2px',
        cursor: 'pointer',
        position: 'relative',
      }}
      className={className}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        selectEl(isSelected ? null : id);
        onClick?.(e);
      }}
      {...rest}
    >
      {isSelected && (
        <span style={{
          position: 'absolute', top: -22, left: 0, zIndex: 9999,
          background: '#7A90B5', color: '#fff', fontSize: 10,
          padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap',
          pointerEvents: 'none', fontFamily: 'monospace',
        }}>
          {id}
        </span>
      )}
      {children}
    </T>
  );
}
