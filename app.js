/**
 * STOLEN FRIDGE TRIPTYCH - Digital Puzzle Experience
 * By Avery Lake
 * 
 * An interactive experience where visitors remove puzzle pieces
 * to reveal Elder Ray Silver's testimony beneath.
 * 
 * Interaction: Remove 3-5 pieces per panel, then auto-complete.
 */

class StolenFridgePuzzle {
    constructor() {
        this.currentPanel = 0;
        this.panels = ['past', 'present', 'future'];
        this.panelLabels = ['Past', 'Present', 'Future'];
        this.piecesRemovedPerPanel = [0, 0, 0];
        this.autoCompleteThreshold = 5; // Auto-complete after 5 pieces
        this.cols = 6;
        this.rows = 8;
        this.grids = {};
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.bindIntroEvents();
        this.generateAllPuzzlePieces();
        this.bindCompletionEvents();
    }

    bindIntroEvents() {
        const startBtn = document.getElementById('start-btn');
        const introScreen = document.getElementById('intro-screen');
        const puzzleContainer = document.getElementById('puzzle-container');

        startBtn.addEventListener('click', () => {
            introScreen.classList.add('hidden');
            puzzleContainer.classList.remove('hidden');
        });
    }

    generateAllPuzzlePieces() {
        this.panels.forEach((panelName, index) => {
            const grid = document.getElementById(`grid-${panelName}`);
            this.grids[panelName] = grid;

            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const piece = document.createElement('div');
                    piece.className = 'puzzle-piece';
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    piece.dataset.panel = panelName;

                    // Set background position to show correct portion of image
                    const xPos = (col / (this.cols - 1)) * 100;
                    const yPos = (row / (this.rows - 1)) * 100;
                    piece.style.backgroundPosition = `${xPos}% ${yPos}%`;

                    // Add click/touch handler
                    piece.addEventListener('click', (e) => this.removePiece(e));

                    grid.appendChild(piece);
                }
            }
        });
    }

    removePiece(event) {
        if (this.isTransitioning) return;

        const piece = event.target;
        if (!piece.classList.contains('puzzle-piece')) return;
        if (piece.classList.contains('removed')) return;

        const panelName = piece.dataset.panel;
        const panelIndex = this.panels.indexOf(panelName);

        // Only allow interaction with current panel
        if (panelIndex !== this.currentPanel) return;

        // Remove the piece
        piece.classList.add('removed');
        this.piecesRemovedPerPanel[panelIndex]++;

        // Check if we should auto-complete
        if (this.piecesRemovedPerPanel[panelIndex] >= this.autoCompleteThreshold) {
            this.autoCompletePanel(panelName, panelIndex);
        }
    }

    autoCompletePanel(panelName, panelIndex) {
        this.isTransitioning = true;
        const grid = this.grids[panelName];
        const panel = document.getElementById(`panel-${panelName}`);
        const remainingPieces = grid.querySelectorAll('.puzzle-piece:not(.removed)');

        // Stagger the removal of remaining pieces
        remainingPieces.forEach((piece, index) => {
            setTimeout(() => {
                piece.classList.add('removed');
            }, index * 40); // 40ms stagger
        });

        // Mark panel complete after all pieces removed
        const totalDelay = remainingPieces.length * 40 + 400;
        setTimeout(() => {
            panel.classList.add('complete');
        }, totalDelay);

        // Transition to next panel or show completion
        setTimeout(() => {
            if (panelIndex < this.panels.length - 1) {
                this.transitionToNextPanel();
            } else {
                this.showCompletion();
            }
        }, totalDelay + 800);
    }

    transitionToNextPanel() {
        const currentPanelEl = document.getElementById(`panel-${this.panels[this.currentPanel]}`);
        currentPanelEl.classList.remove('active');
        currentPanelEl.classList.add('exiting');

        this.currentPanel++;

        const nextPanelEl = document.getElementById(`panel-${this.panels[this.currentPanel]}`);

        // Update progress dots
        this.updateProgressDots();

        // Update panel indicator
        document.getElementById('panel-indicator').textContent = this.panelLabels[this.currentPanel];

        // Small delay before showing next panel
        setTimeout(() => {
            currentPanelEl.classList.remove('exiting');
            nextPanelEl.classList.add('active');
            this.isTransitioning = false;
        }, 500);
    }

    updateProgressDots() {
        const dots = document.querySelectorAll('.progress-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'complete');
            if (index < this.currentPanel) {
                dot.classList.add('complete');
            } else if (index === this.currentPanel) {
                dot.classList.add('active');
            }
        });
    }

    showCompletion() {
        const puzzleContainer = document.getElementById('puzzle-container');
        const completionScreen = document.getElementById('completion-screen');

        puzzleContainer.classList.add('hidden');
        completionScreen.classList.remove('hidden');

        // Trigger animation
        requestAnimationFrame(() => {
            completionScreen.classList.add('visible');
        });
    }

    reset() {
        this.currentPanel = 0;
        this.piecesRemovedPerPanel = [0, 0, 0];
        this.isTransitioning = false;

        // Reset all pieces
        document.querySelectorAll('.puzzle-piece').forEach(piece => {
            piece.classList.remove('removed');
        });

        // Reset all panels
        this.panels.forEach((panelName, index) => {
            const panel = document.getElementById(`panel-${panelName}`);
            panel.classList.remove('complete', 'active', 'exiting');
            if (index === 0) {
                panel.classList.add('active');
            }
        });

        // Reset progress dots
        this.updateProgressDots();

        // Reset panel indicator
        document.getElementById('panel-indicator').textContent = this.panelLabels[0];

        // Hide completion, show puzzle
        const puzzleContainer = document.getElementById('puzzle-container');
        const completionScreen = document.getElementById('completion-screen');

        completionScreen.classList.remove('visible');
        setTimeout(() => {
            completionScreen.classList.add('hidden');
            puzzleContainer.classList.remove('hidden');
        }, 400);
    }

    bindCompletionEvents() {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.reset());
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new StolenFridgePuzzle();
});
