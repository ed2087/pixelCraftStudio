// Modern Pixel Art Placer - Enhanced Version with PNG Download
class PixelArtPlacer {
    constructor() {
        this.canvas = document.getElementById('pixelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 40;
        this.imageOpacity = 0.3;
        this.pixelGrid = [];
        this.originalImage = null;
        this.pixelSize = 10;
        this.showGrid = true;
        this.currentColor = 'K';
        this.isDragging = false;
        this.isTouchDevice = 'ontouchstart' in window;
        
        // Zoom functionality
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 4;
        this.zoomStep = 0.1;
        
        this.wplaceColors = [
            { code: 'K', color: '#000000', name: 'Black' },
            { code: 'G1', color: '#4a4a4a', name: 'Dark Gray' },
            { code: 'G2', color: '#808080', name: 'Gray' },
            { code: 'G3', color: '#c0c0c0', name: 'Light Gray' },
            { code: 'W', color: '#ffffff', name: 'White' },
            { code: 'DR', color: '#800000', name: 'Dark Red' },
            { code: 'R', color: '#ff0000', name: 'Red' },
            { code: 'O', color: '#ff8000', name: 'Orange' },
            { code: 'Y1', color: '#ffa500', name: 'Orange Yellow' },
            { code: 'Y', color: '#ffff00', name: 'Yellow' },
            { code: 'LY', color: '#ffffe0', name: 'Light Yellow' },
            { code: 'DG', color: '#008000', name: 'Dark Green' },
            { code: 'G', color: '#00ff00', name: 'Green' },
            { code: 'LG', color: '#90ee90', name: 'Light Green' },
            { code: 'T1', color: '#008080', name: 'Teal' },
            { code: 'T2', color: '#40e0d0', name: 'Turquoise' },
            { code: 'C', color: '#00ffff', name: 'Cyan' },
            { code: 'DB', color: '#000080', name: 'Dark Blue' },
            { code: 'B', color: '#0080ff', name: 'Blue' },
            { code: 'LB', color: '#add8e6', name: 'Light Blue' },
            { code: 'P1', color: '#8000ff', name: 'Purple' },
            { code: 'P2', color: '#c080ff', name: 'Light Purple' },
            { code: 'M1', color: '#ff00ff', name: 'Magenta' },
            { code: 'M2', color: '#ff80ff', name: 'Light Magenta' },
            { code: 'PI1', color: '#dda0dd', name: 'Plum' },
            { code: 'PI2', color: '#ff1493', name: 'Deep Pink' },
            { code: 'PI3', color: '#ff69b4', name: 'Hot Pink' },
            { code: 'PI4', color: '#ffb6c1', name: 'Light Pink' },
            { code: 'BR1', color: '#8b4513', name: 'Saddle Brown' },
            { code: 'BR2', color: '#d2691e', name: 'Chocolate' },
            { code: 'BR3', color: '#deb887', name: 'Burlywood' },
            { code: 'E', color: 'transparent', name: 'Eraser' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.initColorPalette();
        this.initGrid();
        this.setupZoomControls();
    }
    
    setupElements() {
        this.elements = {
            gridSizeSlider: document.getElementById('gridSize'),
            gridSizeValue: document.getElementById('gridSizeValue'),
            imageOpacitySlider: document.getElementById('imageOpacity'),
            opacityValue: document.getElementById('opacityValue'),
            imageInput: document.getElementById('imageInput'),
            uploadZone: document.getElementById('uploadZone'),
            colorPalette: document.getElementById('colorPalette'),
            autoBtn: document.getElementById('autoBtn'),
            clearBtn: document.getElementById('clearBtn'),
            gridToggle: document.getElementById('gridToggle'),
            exportBtn: document.getElementById('exportBtn'),
            downloadPng: document.getElementById('downloadPng'),
            stats: document.getElementById('stats'),
            progressValue: document.getElementById('progressValue'),
            colorsValue: document.getElementById('colorsValue'),
            emptyValue: document.getElementById('emptyValue'),
            coordinatesToolip: document.getElementById('coordinatesToolip'),
            canvasWrapper: document.querySelector('.canvas-wrapper')
        };
    }
    
    setupZoomControls() {
        // Create zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-btn" id="zoomOut">
                <span>🔍</span>
                <span>-</span>
            </button>
            <span class="zoom-level" id="zoomLevel">100%</span>
            <button class="zoom-btn" id="zoomIn">
                <span>🔍</span>
                <span>+</span>
            </button>
            <button class="zoom-btn" id="zoomReset">
                <span>🎯</span>
                <span>Reset</span>
            </button>
        `;
        
        // Insert before canvas wrapper
        this.elements.canvasWrapper.parentNode.insertBefore(zoomControls, this.elements.canvasWrapper);
        
        // Add zoom control event listeners
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
        document.getElementById('zoomReset').addEventListener('click', () => this.resetZoom());
        
        this.elements.zoomLevel = document.getElementById('zoomLevel');
    }
    
    zoomIn() {
        this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
        this.updateZoom();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
        this.updateZoom();
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.updateZoom();
    }
    
    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.canvas.style.transformOrigin = 'center center';
        this.elements.zoomLevel.textContent = Math.round(this.zoomLevel * 100) + '%';
        
        // Update wrapper to handle overflow
        this.elements.canvasWrapper.style.overflow = this.zoomLevel > 1 ? 'auto' : 'hidden';
    }
    
    setupEventListeners() {
        // Sliders
        this.elements.gridSizeSlider.addEventListener('input', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.elements.gridSizeValue.textContent = this.gridSize;
            this.initGrid();
        });
        
        this.elements.imageOpacitySlider.addEventListener('input', (e) => {
            this.imageOpacity = parseInt(e.target.value) / 100;
            this.elements.opacityValue.textContent = e.target.value + '%';
            this.redrawCanvas();
        });
        
        // Upload
        this.elements.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.elements.uploadZone.addEventListener('click', () => this.elements.imageInput.click());
        this.setupDragAndDrop();
        
        // Buttons
        this.elements.autoBtn.addEventListener('click', () => this.autoConvert());
        this.elements.clearBtn.addEventListener('click', () => this.clearCanvas());
        this.elements.gridToggle.addEventListener('click', () => this.toggleGrid());
        this.elements.exportBtn.addEventListener('click', () => this.exportGrid());
        this.elements.downloadPng.addEventListener('click', () => this.downloadPNG());
        
        // Canvas events
        this.setupCanvasEvents();
        
        // Mouse wheel zoom
        this.elements.canvasWrapper.addEventListener('wheel', (e) => this.handleWheel(e));
    }
    
    // PNG Download Function
    downloadPNG() {
        // Create a new canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set canvas size to actual pixel dimensions
        exportCanvas.width = this.gridSize;
        exportCanvas.height = this.gridSize;
        
        // Draw each pixel
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const colorCode = this.pixelGrid[y][x];
                if (colorCode && colorCode !== '') {
                    const colorData = this.wplaceColors.find(c => c.code === colorCode);
                    if (colorData && colorData.color !== 'transparent') {
                        exportCtx.fillStyle = colorData.color;
                        exportCtx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
        
        // Create download link
        const link = document.createElement('a');
        link.download = `pixel-art-${this.gridSize}x${this.gridSize}-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
        
        this.showNotification('PNG downloaded successfully!', 'success');
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }
    }
    
    setupCanvasEvents() {
        if (this.isTouchDevice) {
            this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        } else {
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
            this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
    }
    
    setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.elements.uploadZone.addEventListener(eventName, this.preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            this.elements.uploadZone.addEventListener(eventName, () => {
                this.elements.uploadZone.classList.add('dragover');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.elements.uploadZone.addEventListener(eventName, () => {
                this.elements.uploadZone.classList.remove('dragover');
            });
        });
        
        this.elements.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    handleDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0]);
        }
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file);
        }
    }
    
    processImageFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.redrawCanvas();
                this.showNotification('Image loaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    initColorPalette() {
        this.elements.colorPalette.innerHTML = '';
        
        this.wplaceColors.forEach(colorData => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.dataset.color = colorData.code;
            swatch.title = colorData.name;
            
            if (colorData.color === 'transparent') {
                swatch.classList.add('eraser');
            } else {
                swatch.style.backgroundColor = colorData.color;
                if (colorData.color === '#ffffff') {
                    swatch.style.border = '2px solid #ddd';
                }
            }
            
            if (colorData.code === 'K') {
                swatch.classList.add('active');
            }
            
            swatch.addEventListener('click', () => {
                document.querySelector('.color-swatch.active')?.classList.remove('active');
                swatch.classList.add('active');
                this.currentColor = colorData.code;
            });
            
            this.elements.colorPalette.appendChild(swatch);
        });
    }
    
    initGrid() {
        this.pixelGrid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
        
        const containerWidth = Math.min(window.innerWidth - 80, 600);
        this.pixelSize = Math.max(8, Math.floor(containerWidth / this.gridSize));
        
        this.canvas.width = this.gridSize * this.pixelSize;
        this.canvas.height = this.gridSize * this.pixelSize;
        
        this.redrawCanvas();
        this.updateStats();
    }
    
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background image
        if (this.originalImage && this.imageOpacity > 0) {
            this.ctx.save();
            this.ctx.globalAlpha = this.imageOpacity;
            this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        
        // Draw pixels
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.pixelGrid[y][x] !== '') {
                    this.drawPixel(x, y, this.pixelGrid[y][x]);
                }
            }
        }
        
        // Draw grid
        if (this.showGrid) {
            this.drawGridLines();
        }
    }
    
    drawPixel(x, y, colorCode) {
        const colorData = this.wplaceColors.find(c => c.code === colorCode);
        if (!colorData || colorData.color === 'transparent') return;
        
        this.ctx.fillStyle = colorData.color;
        this.ctx.fillRect(
            x * this.pixelSize + 1, 
            y * this.pixelSize + 1, 
            this.pixelSize - 2, 
            this.pixelSize - 2
        );
        
        if (this.pixelSize > 10) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeRect(
                x * this.pixelSize + 1, 
                y * this.pixelSize + 1, 
                this.pixelSize - 2, 
                this.pixelSize - 2
            );
        }
    }
    
    drawGridLines() {
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.gridSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.pixelSize, 0);
            this.ctx.lineTo(x * this.pixelSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.pixelSize);
            this.ctx.lineTo(this.canvas.width, y * this.pixelSize);
            this.ctx.stroke();
        }
    }
    
    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        // Account for zoom level
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: Math.floor(((clientX - rect.left) * scaleX) / this.pixelSize),
            y: Math.floor(((clientY - rect.top) * scaleY) / this.pixelSize)
        };
    }
    
    placePixel(e) {
        const coords = this.getCanvasCoordinates(e);
        const { x, y } = coords;
        
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            if (this.currentColor === 'E') {
                this.pixelGrid[y][x] = '';
            } else {
                this.pixelGrid[y][x] = this.currentColor;
            }
            this.redrawCanvas();
            this.updateStats();
        }
    }
    
    // Touch Events
    handleTouchStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.placePixel(e);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDragging) {
            this.placePixel(e);
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.isDragging = false;
    }
    
    // Mouse Events
    handleMouseDown(e) {
        this.isDragging = true;
        this.placePixel(e);
    }
    
    handleMouseMove(e) {
        const coords = this.getCanvasCoordinates(e);
        const { x, y } = coords;
        
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            this.showCoordinates(e, x, y);
        } else {
            this.hideCoordinates();
        }
        
        if (this.isDragging) {
            this.placePixel(e);
        }
    }
    
    handleMouseUp() {
        this.isDragging = false;
    }
    
    handleMouseLeave() {
        this.hideCoordinates();
        this.isDragging = false;
    }
    
    showCoordinates(e, x, y) {
        const currentPixel = this.pixelGrid[y][x] || 'Empty';
        this.elements.coordinatesToolip.textContent = `(${x}, ${y}) - ${currentPixel}`;
        this.elements.coordinatesToolip.style.display = 'block';
        this.elements.coordinatesToolip.style.left = e.clientX + 'px';
        this.elements.coordinatesToolip.style.top = (e.clientY - 40) + 'px';
    }
    
    hideCoordinates() {
        this.elements.coordinatesToolip.style.display = 'none';
    }
    
    autoConvert() {
        if (!this.originalImage) {
            this.showNotification('Please upload an image first!', 'error');
            return;
        }
        
        this.elements.autoBtn.classList.add('loading');
        this.elements.autoBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Converting...</span>';
        
        setTimeout(() => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = this.gridSize;
            tempCanvas.height = this.gridSize;
            tempCtx.drawImage(this.originalImage, 0, 0, this.gridSize, this.gridSize);
            
            const imageData = tempCtx.getImageData(0, 0, this.gridSize, this.gridSize);
            const data = imageData.data;
            
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    const index = (y * this.gridSize + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const a = data[index + 3];
                    
                    if (a < 50) {
                        this.pixelGrid[y][x] = '';
                        continue;
                    }
                    
                    this.pixelGrid[y][x] = this.findClosestColor(r, g, b);
                }
            }
            
            this.redrawCanvas();
            this.updateStats();
            
            this.elements.autoBtn.classList.remove('loading');
            this.elements.autoBtn.innerHTML = '<span class="btn-icon">🤖</span><span>Auto Convert</span>';
            this.showNotification('Auto conversion completed!', 'success');
        }, 100);
    }
    
    findClosestColor(r, g, b) {
        let minDistance = Infinity;
        let closestColor = 'K';
        
        this.wplaceColors.forEach(colorData => {
            if (colorData.color === 'transparent') return;
            
            const hex = colorData.color;
            const cr = parseInt(hex.slice(1, 3), 16);
            const cg = parseInt(hex.slice(3, 5), 16);
            const cb = parseInt(hex.slice(5, 7), 16);
            
            const distance = Math.sqrt(
                Math.pow(r - cr, 2) + 
                Math.pow(g - cg, 2) + 
                Math.pow(b - cb, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = colorData.code;
            }
        });
        
        return closestColor;
    }
    
    clearCanvas() {
        if (confirm('Clear all pixels? This cannot be undone.')) {
            this.initGrid();
            this.showNotification('Canvas cleared!', 'success');
        }
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        const icon = this.showGrid ? '📊' : '📋';
        const text = this.showGrid ? 'Hide Grid' : 'Show Grid';
        this.elements.gridToggle.innerHTML = `<span class="btn-icon">${icon}</span><span>${text}</span>`;
        this.redrawCanvas();
    }
    
    exportGrid() {
        const output = this.generateGridOutput();
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixelart_${this.gridSize}x${this.gridSize}_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Grid exported successfully!', 'success');
    }
    
    generateGridOutput() {
        let output = '';
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const pixel = this.pixelGrid[y][x];
                output += pixel || ' ';
            }
            if (y < this.gridSize - 1) output += '\n';
            }
        return output;
    }
    
    updateStats() {
        let counts = {};
        let totalFilled = 0;
        
        // Initialize counts
        this.wplaceColors.forEach(color => {
            counts[color.code] = 0;
        });
        counts.empty = 0;
        
        // Count pixels
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const pixel = this.pixelGrid[y][x];
                
                if (!pixel || pixel === '') {
                    counts.empty++;
                } else {
                    counts[pixel] = (counts[pixel] || 0) + 1;
                    totalFilled++;
                }
            }
        }
        
        const total = this.gridSize * this.gridSize;
        const progress = Math.round((totalFilled / total) * 100);
        
        this.elements.progressValue.textContent = progress + '%';
        this.elements.colorsValue.textContent = totalFilled;
        this.elements.emptyValue.textContent = counts.empty;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: var(--glass-bg);
            backdrop-filter: blur(var(--glass-blur));
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: var(--spacing-sm) var(--spacing-md);
            color: var(--text-primary);
            font-weight: 500;
            font-size: 0.875rem;
            box-shadow: var(--glass-shadow);
            transform: translateX(100%);
            transition: var(--transition);
            max-width: 300px;
        `;
        
        // Set message and icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <span style="margin-right: 8px;">${icons[type] || icons.info}</span>
            ${message}
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Utility method for responsive canvas sizing
    handleResize() {
        const containerWidth = Math.min(window.innerWidth - 80, 600);
        this.pixelSize = Math.max(8, Math.floor(containerWidth / this.gridSize));
        
        this.canvas.width = this.gridSize * this.pixelSize;
        this.canvas.height = this.gridSize * this.pixelSize;
        
        this.redrawCanvas();
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.key.toLowerCase()) {
                case 'c':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.exportGrid();
                    } else {
                        this.clearCanvas();
                    }
                    break;
                case 'g':
                    e.preventDefault();
                    this.toggleGrid();
                    break;
                case 'a':
                    e.preventDefault();
                    this.autoConvert();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportGrid();
                    break;
                case 'p':
                    e.preventDefault();
                    this.downloadPNG();
                    break;
                case '=':
                case '+':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.resetZoom();
                    }
                    break;
                case 'escape':
                    this.hideCoordinates();
                    break;
            }
        });
    }
    
    // Performance optimization for large grids
    optimizeCanvas() {
        // Enable hardware acceleration
        this.ctx.imageSmoothingEnabled = false;
        
        // Use requestAnimationFrame for smooth animations
        this.animationFrame = null;
        
        this.scheduleRedraw = () => {
            if (this.animationFrame) return;
            
            this.animationFrame = requestAnimationFrame(() => {
                this.redrawCanvas();
                this.animationFrame = null;
            });
        };
    }
    
    // Error handling
    handleError(error, context) {
        console.error(`PixelArt Error in ${context}:`, error);
        this.showNotification(`Error: ${error.message}`, 'error');
    }
    
    // Initialize everything
    start() {
        try {
            this.setupKeyboardShortcuts();
            this.optimizeCanvas();
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            // Show welcome message
            setTimeout(() => {
                this.showNotification('Welcome to PixelCraft Studio! Ready to create!', 'success');
            }, 1000);
            
        } catch (error) {
            this.handleError(error, 'initialization');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pixelArt = new PixelArtPlacer();
    pixelArt.start();
    
    // Make available globally for debugging
    window.pixelArt = pixelArt;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelArtPlacer;
}



// Mobile menu toggle functionality (add this to your existing script.js)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
            
            // Prevent body scroll when sidebar is open on mobile
            if (sidebar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && 
                sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                sidebar.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});