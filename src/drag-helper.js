/**
 * Drag Helper for Renderer Process
 * Include this in your HTML/renderer to enable window dragging
 */

class WindowDragHelper {
    constructor(dragSelector = '.drag-handle') {
        this.dragSelector = dragSelector;
        this.isDragging = false;
        this.startPos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Make entire window draggable by default if no specific drag handle
        const dragElements = document.querySelectorAll(this.dragSelector);
        
        if (dragElements.length === 0) {
            // Make entire body draggable
            this.makeDraggable(document.body);
        } else {
            // Make specific elements draggable
            dragElements.forEach(element => this.makeDraggable(element));
        }
    }

    makeDraggable(element) {
        element.style.cursor = 'move';
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.webkitAppRegion = 'drag';

        element.addEventListener('mousedown', (e) => {
            this.startDrag(e);
        });

        element.addEventListener('mouseup', () => {
            this.endDrag();
        });

        element.addEventListener('mouseleave', () => {
            this.endDrag();
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.startPos = {
            x: e.screenX,
            y: e.screenY
        };

        // Send drag start message to main process
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('window-drag-start', {
                x: e.offsetX,
                y: e.offsetY
            });
        }

        document.addEventListener('mousemove', this.handleDrag.bind(this));
    }

    handleDrag(e) {
        if (!this.isDragging) return;

        // Send drag move message to main process
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('window-drag-move', {
                x: e.screenX,
                y: e.screenY
            });
        }
    }

    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag.bind(this));

        // Send drag end message to main process
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('window-drag-end');
        }
    }

    // Add drag handle to existing element
    addDragHandle(element) {
        this.makeDraggable(element);
    }

    // Remove drag functionality from element
    removeDragHandle(element) {
        element.style.cursor = '';
        element.style.webkitAppRegion = 'no-drag';
        element.removeEventListener('mousedown', this.startDrag);
        element.removeEventListener('mouseup', this.endDrag);
        element.removeEventListener('mouseleave', this.endDrag);
    }
}

// Auto-initialize if in renderer process
if (typeof window !== 'undefined' && window.require) {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize with default drag handles
        new WindowDragHelper('.drag-handle, .window-header, .title-bar');
    });
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowDragHelper;
}