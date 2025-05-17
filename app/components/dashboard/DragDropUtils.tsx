import React from 'react';
import { FileIcon, FolderIcon, ImageIcon } from 'lucide-react';

// Define the interface for a draggable item
export interface DraggableItem {
  id: string;
  name: string;
  type: string;
  size: number;
  modified: string;
  starred: boolean;
  categoryId: string | null;
  parentId: string | null;
}

/**
 * Creates a custom drag image element for better visual feedback
 */
export function createDragImage(file: DraggableItem, additionalFiles: number = 0): HTMLElement {
  // Create container for drag image
  const dragImage = document.createElement('div');
  dragImage.className = 'drag-preview';
  dragImage.style.width = '120px';
  dragImage.style.height = '100px';
  
  // If it's an image file, try to use the actual image
  if (file.type.startsWith('image/')) {
    try {
      // For demo purposes we'll create a colored div, in a real app you'd use:
      // const img = document.createElement('img');
      // img.src = URL.createObjectURL(file);
      // img.className = 'drag-preview-image';
      // dragImage.appendChild(img);
      
      const imgPlaceholder = document.createElement('div');
      imgPlaceholder.style.width = '100%';
      imgPlaceholder.style.height = '100%';
      imgPlaceholder.style.backgroundColor = '#3B82F6';
      imgPlaceholder.style.borderRadius = '4px';
      imgPlaceholder.style.display = 'flex';
      imgPlaceholder.style.alignItems = 'center';
      imgPlaceholder.style.justifyContent = 'center';
      
      const icon = document.createElement('div');
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
      icon.style.color = 'white';
      
      imgPlaceholder.appendChild(icon);
      dragImage.appendChild(imgPlaceholder);
    } catch (error) {
      console.error('Failed to create image preview:', error);
      createIconPreview(dragImage, 'image');
    }
  } else if (file.type.startsWith('text/') || file.type.includes('document')) {
    createIconPreview(dragImage, 'document', file);
  } else {
    createIconPreview(dragImage, 'file', file);
  }
  
  // Add file name
  const nameElement = document.createElement('div');
  nameElement.style.position = 'absolute';
  nameElement.style.bottom = '0';
  nameElement.style.left = '0';
  nameElement.style.right = '0';
  nameElement.style.padding = '4px';
  nameElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  nameElement.style.color = 'white';
  nameElement.style.fontSize = '10px';
  nameElement.style.whiteSpace = 'nowrap';
  nameElement.style.overflow = 'hidden';
  nameElement.style.textOverflow = 'ellipsis';
  nameElement.style.borderBottomLeftRadius = '7px';
  nameElement.style.borderBottomRightRadius = '7px';
  nameElement.textContent = file.name;
  dragImage.appendChild(nameElement);
  
  // Add badge for multiple files
  if (additionalFiles > 0) {
    const badge = document.createElement('div');
    badge.className = 'drag-preview-count';
    badge.textContent = `+${additionalFiles}`;
    dragImage.appendChild(badge);
  }
  
  // Add effect for copy operation
  dragImage.classList.add('copy');
  
  // Add some animation on creation
  dragImage.style.transform = 'scale(0.95)';
  setTimeout(() => {
    dragImage.style.transform = 'scale(1)';
  }, 50);
  
  return dragImage;
}

/**
 * Creates an icon-based preview for non-image files
 */
function createIconPreview(container: HTMLElement, type: 'image' | 'document' | 'file', file?: DraggableItem) {
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'drag-preview-icon';
  iconWrapper.style.width = '100%';
  iconWrapper.style.height = '100%';
  iconWrapper.style.backgroundColor = type === 'image' 
    ? '#3B82F6' 
    : type === 'document' 
      ? '#10B981' 
      : '#6366F1';
  iconWrapper.style.borderRadius = '4px';
  iconWrapper.style.display = 'flex';
  iconWrapper.style.alignItems = 'center';
  iconWrapper.style.justifyContent = 'center';
  iconWrapper.style.color = 'white';
  
  // Set icon based on file type
  let iconSvg = '';
  
  if (type === 'image') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
  } else if (type === 'document') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }
  
  iconWrapper.innerHTML = iconSvg;
  container.appendChild(iconWrapper);
  
  // Add file extension if available
  if (file && file.name) {
    const extension = file.name.split('.').pop()?.toUpperCase();
    if (extension && extension !== file.name.toUpperCase()) {
      const extensionBadge = document.createElement('div');
      extensionBadge.style.position = 'absolute';
      extensionBadge.style.top = '50%';
      extensionBadge.style.left = '50%';
      extensionBadge.style.transform = 'translate(-50%, 20px)';
      extensionBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      extensionBadge.style.color = iconWrapper.style.backgroundColor;
      extensionBadge.style.padding = '2px 4px';
      extensionBadge.style.borderRadius = '3px';
      extensionBadge.style.fontSize = '10px';
      extensionBadge.style.fontWeight = 'bold';
      extensionBadge.textContent = extension;
      container.appendChild(extensionBadge);
    }
  }
}

/**
 * Handles the drag start event for a single file
 */
export function handleFileDragStart(e: React.DragEvent, file: DraggableItem): void {
  // Set data transfer properties
  e.dataTransfer.effectAllowed = 'copyMove';
  e.dataTransfer.setData('application/json', JSON.stringify({ 
    files: [file],
    operation: 'copy'
  }));
  
  // Create and set custom drag image
  const dragImage = createDragImage(file);
  document.body.appendChild(dragImage);
  
  // Calculate offset to center the drag image under the cursor
  const offsetX = dragImage.offsetWidth / 2;
  const offsetY = dragImage.offsetHeight / 2;
  
  e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
  
  // Dispatch custom event to notify sidebar about dragged file
  window.dispatchEvent(new CustomEvent('filesDragStart', {
    detail: {
      files: [file]
    }
  }));
  
  // Add class to body for global styling during drag
  document.body.classList.add('dragging-files');
  
  // Clean up drag image after a short delay
  setTimeout(() => {
    if (dragImage.parentNode) {
      document.body.removeChild(dragImage);
    }
  }, 100);
}

/**
 * Handles the drag start event for multiple files (when in selection mode)
 */
export function handleMultiDragStart(e: React.DragEvent, selectedFiles: DraggableItem[]): void {
  if (selectedFiles.length === 0) return;
  
  // Set data transfer properties
  e.dataTransfer.effectAllowed = 'copyMove';
  e.dataTransfer.setData('application/json', JSON.stringify({ 
    files: selectedFiles,
    operation: 'copy'
  }));
  
  // Create and set custom drag image with indicator for multiple files
  const dragImage = createDragImage(selectedFiles[0], selectedFiles.length - 1);
  document.body.appendChild(dragImage);
  
  // Calculate offset to center the drag image under the cursor
  const offsetX = dragImage.offsetWidth / 2;
  const offsetY = dragImage.offsetHeight / 2;
  
  e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
  
  // Dispatch custom event to notify sidebar about dragged files
  window.dispatchEvent(new CustomEvent('filesDragStart', {
    detail: {
      files: selectedFiles
    }
  }));
  
  // Add class to body for global styling during drag
  document.body.classList.add('dragging-files');
  
  // Clean up drag image after a short delay
  setTimeout(() => {
    if (dragImage.parentNode) {
      document.body.removeChild(dragImage);
    }
  }, 100);
}

/**
 * Handles the end of a drag operation
 */
export function handleFileDragEnd(e: React.DragEvent, timeoutRef?: React.MutableRefObject<any>): void {
  // Clear timeout if it exists
  if (timeoutRef?.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
  
  // Add a small delay to ensure drag image is properly cleaned up
  setTimeout(() => {
    // Dispatch custom event to notify sidebar that drag has ended
    window.dispatchEvent(new CustomEvent('filesDragEnd'));
    
    // Remove class from body
    document.body.classList.remove('dragging-files');
  }, 50);
} 