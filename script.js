/**
 * HTML5 Elements Showcase & Interactive Sandbox - Core Scripts
 * -------------------------------------------------------------
 * Provides responsive controls, native Web API implementations,
 * animations, and custom element registrations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. DUAL THEME TOGGLE (LIGHT & DARK MODES)
    // --------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference for default theme
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.classList.add('light-theme');
        themeToggleBtn.textContent = '🌙 Light Mode';
    } else {
        themeToggleBtn.textContent = '☀️ Dark Mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        if (isLight) {
            themeToggleBtn.textContent = '🌙 Light Mode';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggleBtn.textContent = '☀️ Dark Mode';
            localStorage.setItem('theme', 'dark');
        }
    });

    // --------------------------------------------------
    // 2. NATIVE DIALOG MODAL CONTROLLER
    // --------------------------------------------------
    const openDialogBtn = document.getElementById('open-dialog-btn');
    const diagnosticDialog = document.getElementById('diagnostic-dialog');
    const closeDialogBtn = document.getElementById('close-dialog-btn');

    if (openDialogBtn && diagnosticDialog) {
        openDialogBtn.addEventListener('click', () => {
            diagnosticDialog.showModal();
        });

        // Optional: Close dialog when clicking outside on the backdrop
        diagnosticDialog.addEventListener('click', (event) => {
            const rect = diagnosticDialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                diagnosticDialog.close();
            }
        });
    }

    // --------------------------------------------------
    // 3. INTERACTIVE 2D CANVAS DRAWING (GLOWING GEOMETRY)
    // --------------------------------------------------
    const canvas = document.getElementById('demo-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let angle = 0;

        function drawCanvasFrame() {
            // Clear canvas with trace transparency for motion trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.min(centerX, centerY) - 10;

            // Draw spinning nested wireframe squares
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);

            // Draw outer loop shape (cyan)
            ctx.strokeStyle = '#00d2ff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00d2ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(-maxRadius * 0.7, -maxRadius * 0.7, maxRadius * 1.4, maxRadius * 1.4);

            // Draw inner loop shape (purple/pink)
            ctx.rotate(-angle * 2.5);
            ctx.strokeStyle = '#f067b4';
            ctx.shadowColor = '#f067b4';
            ctx.strokeRect(-maxRadius * 0.4, -maxRadius * 0.4, maxRadius * 0.8, maxRadius * 0.8);

            ctx.restore();

            angle += 0.015;
            requestAnimationFrame(drawCanvasFrame);
        }

        // Initialize animation loop
        drawCanvasFrame();
    }

    // --------------------------------------------------
    // 4. NATIVE DRAG AND DROP API IMPLEMENTATION
    // --------------------------------------------------
    const draggableItem = document.getElementById('draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    if (draggableItem) {
        draggableItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', draggableItem.id);
            // Visual style during dragging
            setTimeout(() => {
                draggableItem.style.opacity = '0.5';
            }, 0);
        });

        draggableItem.addEventListener('dragend', () => {
            draggableItem.style.opacity = '1';
        });
    }

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Required to allow dropping
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const itemId = e.dataTransfer.getData('text/plain');
            const dragged = document.getElementById(itemId);
            if (dragged) {
                zone.appendChild(dragged);
            }
        });
    });

    // --------------------------------------------------
    // 5. INTERACTIVE FORM ELEMENT PROCESSORS
    // --------------------------------------------------
    const multiplierSlider = document.getElementById('multiplier-slider');
    const sliderOutput = document.getElementById('slider-output');
    const syncProgress = document.getElementById('sync-progress');
    const progressVal = document.getElementById('progress-val');

    if (multiplierSlider && sliderOutput) {
        multiplierSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            sliderOutput.value = val;
            
            // Link range slider directly to progress bar to show interactive binding
            if (syncProgress && progressVal) {
                syncProgress.value = val;
                progressVal.textContent = `${val}% Completed`;
            }
        });
    }
});

// --------------------------------------------------
// 6. CUSTOM WEB COMPONENT REGISTRATION (SHADOW DOM)
// --------------------------------------------------
class UserCard extends HTMLElement {
    constructor() {
        super();
        // Attach Shadow Root
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Retrieve template defined in index.html
        const template = document.getElementById('user-card-template');
        
        if (template) {
            const content = template.content.cloneNode(true);
            shadow.appendChild(content);
        } else {
            // Fallback content if template is missing
            const fallbackDiv = document.createElement('div');
            fallbackDiv.style.border = '1px solid red';
            fallbackDiv.style.padding = '10px';
            fallbackDiv.innerHTML = '<p>Error: Component Template missing</p>';
            shadow.appendChild(fallbackDiv);
        }
    }
}

// Define the element in the browser's registry if not already defined
if (!customElements.get('user-card')) {
    customElements.define('user-card', UserCard);
}
