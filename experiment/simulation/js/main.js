// STEP CONTROLLER
let step = 0;
let instrCount = 0; 

// ELEMENT REFERENCES
const simStage = document.getElementById("simStage"); 
const title = document.getElementById("titleScreen");
const nextBtn = document.getElementById("nextBtn");
const machineLower = document.getElementById("machineLower");
const machineUpper = document.getElementById("machineUpper");
const cone = document.getElementById("cone");
const cap = document.getElementById("cap");
const tray = document.getElementById("tray");
const spade = document.getElementById("spade");
const arrow = document.getElementById("arrow");
const concreteOnSpade = document.getElementById("concreteOnSpade");
const instructionsBox = document.getElementById("instructionsBox");

// HELPER to update CSS-based instructions
function setInstruction(num) {
    instructionsBox.style.opacity = 1;
    instructionsBox.setAttribute("data-step", num);
}

// *** NEW: UNLOCK BUTTON HELPER ***
function unlockNextBtn() {
    nextBtn.style.pointerEvents = "auto";
    nextBtn.style.opacity = "1";
    // Reset animation to ensure it restarts
    nextBtn.style.animation = "none";
    nextBtn.offsetHeight; /* Trigger reflow to restart animation */
    nextBtn.style.animation = "blink 1.2s infinite ease-in-out";
}

// UTILITY TO GET STAGE DIMENSIONS
function getStageDimensions() {
    return {
        width: simStage.offsetWidth,
        height: simStage.offsetHeight
    };
}

let concreteLoaded = false;
let secondSpadeClick = false;

// Store initial positions
let spadeStart = {};
let concreteStart = {};
let concrete3Start = {};
let concrete6Start = {};
let concrete9Start = {};

function updatePositions() {
    spadeStart = {
        left: spade.offsetLeft,
        bottom: parseInt(getComputedStyle(spade).bottom)
    };
    concreteStart = {
        left: concreteOnSpade.offsetLeft,
        bottom: parseInt(getComputedStyle(concreteOnSpade).bottom)
    };
}

const concreteInCone = document.getElementById("concreteInCone");
const concreteInCone2 = document.getElementById("concreteInCone2");
const leveler = document.getElementById("leveler");
const levelerArrow = document.getElementById("levelerArrow");

let levelerReady = false;
let currentLevelingPhase = 0; 
const concreteOnSpade3 = document.getElementById("concreteOnSpade3");
let readyForShake = false;
let readyForFinalCarry = false;

function updateConcrete3Positions() {
    concrete3Start = {
        left: concreteOnSpade3.offsetLeft,
        bottom: parseInt(getComputedStyle(concreteOnSpade3).bottom)
    };
}

const concreteInCone4 = document.getElementById("concreteInCone4");
const concreteInCone5 = document.getElementById("concreteInCone5");
const concreteOnSpade6 = document.getElementById("concreteOnSpade6");
let readyForShake6 = false;
let readyForFinalCarry6 = false;

function updateConcrete6Positions() {
    concrete6Start = {
        left: concreteOnSpade6.offsetLeft,
        bottom: parseInt(getComputedStyle(concreteOnSpade6).bottom)
    };
}

const concreteInCone7 = document.getElementById("concreteInCone7");
const concreteInCone8 = document.getElementById("concreteInCone8");
let readyForShake9 = false;
let readyForFinalCarry9 = false;
const concreteOnSpade9 = document.getElementById("concreteOnSpade9");
const concreteInCone9 = document.getElementById("concreteInCone9");

function updateConcrete9Positions() {
    concrete9Start = {
        left: concreteOnSpade9.offsetLeft,
        bottom: parseInt(getComputedStyle(concreteOnSpade9).bottom)
    };
}

const concreteInCone10 = document.getElementById("concreteInCone10");
const concreteInCone11 = document.getElementById("concreteInCone11");
const levelerHigh = document.getElementById("levelerHigh");
let levelerHighReady = false;
const machineUpperMirror = document.getElementById("machineUpperMirror");
let testCompleted = false;
let cleanupDone = false;
const concreteInCone12 = document.getElementById("concreteInCone12");
const machineUpperMirror1 = document.getElementById("machineUpperMirror1");
let mirrorSwapDone = false;
const vibrator = document.getElementById("vibrator");
const clock = document.getElementById("clock");
const minuteHand = document.getElementById("minuteHand");
let vibrationStarted = false;
const concreteInCone13 = document.getElementById("concreteInCone13");
let vibrationStopped = false;

// HELPER: Reset Spade to CSS Positioning
function resetSpadeToCSS(concreteElement) {
    spade.style.left = "";
    spade.style.bottom = "";
    if (concreteElement) {
        concreteElement.style.left = "";
        concreteElement.style.bottom = "";
    }
    updatePositions();
    updateConcrete3Positions();
    updateConcrete6Positions();
    updateConcrete9Positions();
}

// NEXT BUTTON LOGIC
nextBtn.addEventListener("click", () => {
    // *** 1. LOCK THE BUTTON IMMEDIATELY ON CLICK ***
    nextBtn.style.animation = "none";
    nextBtn.style.opacity = 0.5;
    nextBtn.style.pointerEvents = "none";

    if (step === 0) {
        setInstruction(1);
        title.style.transition = "0.5s";
        title.style.opacity = 0;
        setTimeout(() => {
            title.style.display = "none";
            machineLower.style.opacity = 1;
            machineUpper.style.opacity = 1;
            step = 1;
            unlockNextBtn(); // Unlock for Step 1 -> 2
        }, 500);
    }
    else if (step === 1) { 
        setInstruction(2); 
        cone.style.opacity = 1; 
        step = 2; 
        setTimeout(() => unlockNextBtn(), 500); // Unlock for Step 2 -> 3
    }
    else if (step === 2) { 
        setInstruction(3); 
        cap.style.opacity = 1; 
        step = 3; 
        setTimeout(() => unlockNextBtn(), 500); // Unlock for Step 3 -> 4
    }
    else if (step === 3) { 
        setInstruction(4); 
        cone.classList.add("move-to-machine"); 
        cap.classList.add("move-to-machine"); 
        step = 4; 
        setTimeout(() => unlockNextBtn(), 800); // Unlock after movement
    }
    else if (step === 4) { 
        setInstruction(5); 
        tray.style.opacity = 1; 
        spade.style.opacity = 1; 
        step = 5; 
        setTimeout(() => unlockNextBtn(), 500);
    }
    else if (step === 5) { 
        setInstruction(6); 
        arrow.classList.add("active"); 
        spade.classList.add("interactive"); 
        step = 6; 
        // NOTE: We do NOT unlock here. Interaction shifts to the Spade/Leveler.
        // It will be unlocked in levelerHigh click event.
    }
    else if (step === 6 && testCompleted && !cleanupDone) {
        setInstruction(14);
        cleanupDone = "ready";
        // SEQUENCE 1: Move Cap to original position
        cap.classList.remove("move-to-machine");
        cap.classList.add("finished-pos");
        setTimeout(() => unlockNextBtn(), 500);
    }
    else if (cleanupDone === "ready") {
        setInstruction(15);

        // Wait for Cap animation (0.7s) before moving Cone
        setTimeout(() => {
            
            // SEQUENCE 2: Move Cone to original position
            cone.classList.remove("move-to-machine");
            cone.classList.add("return-to-start"); // GO UP

            // Trigger Step 2 & 3: GO LEFT THEN DOWN
            setTimeout(() => {
                cone.classList.add("at-start");
            }, 600); 

            // Wait for Cone animation to finish before rotating Machine
            setTimeout(() => {
                
                // SEQUENCE 3: Rotate Machine
                machineUpper.style.opacity = 0;
                machineUpperMirror1.style.opacity = 1; // Show the final rotated/mirror state
                
                // Swap concrete visuals
                concreteInCone11.style.opacity = 0;
                concreteInCone12.style.opacity = 1;
                
                cleanupDone = true;
                mirrorSwapDone = true;
                unlockNextBtn();
            }, 2000); // Allows enough time for the full Cone path (Up + Left/Down)

        }, 800); // 800ms delay to let Cap finish moving first
    }
    else if (mirrorSwapDone && !vibrationStarted) {
        setInstruction(16);
        vibrator.style.opacity = 1; 
        clock.style.opacity = 1;
        vibrator.classList.add("active"); // Vibrator starts shaking
        
        // Start the rotation to 1 o'clock (30 degrees)
        minuteHand.classList.add("stop-at-one");
        
        vibrationStarted = true;

        // Wait for the 2-second clock animation to finish
        setTimeout(() => {
            // 1. Stop the vibrator
            vibrator.classList.remove("active"); 
            
            // 2. AUTOMATICALLY TRANSITION (No click needed)
            concreteInCone12.style.opacity = 0;
            concreteInCone13.style.opacity = 1;
            vibrationStopped = true;

            // 3. Show the "5 sec" text
            const resultText = document.getElementById("testResultText");
            if (resultText) resultText.style.opacity = 1;

            // 4. Move to the input stage after a short delay
            setTimeout(() => {
                step = 17;
                setInstruction(17);
                showTimeInput();
            }, 500);

        }, 2000);
    }
    else if (vibrationStarted && !vibrationStopped) {
        // Transition concrete state
        concreteInCone12.style.opacity = 0;
        concreteInCone13.style.opacity = 1;
        vibrationStopped = true;

        // Show the "5 sec" text next to the clock
        const resultText = document.getElementById("testResultText");
        if (resultText) resultText.style.opacity = 1;

        setTimeout(() => {
            step = 17;
            setInstruction(17);
            showTimeInput();
        }, 500);
    }
});

let spadeUsed = false;

// SPADE INTERACTION
spade.addEventListener("click", () => {
    if (step >= 5 && !spadeUsed) {
        spadeUsed = true;
        setInstruction(7);
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        spade.classList.add("scooping");
        setTimeout(() => {
            spade.classList.remove("scooping");
            concreteOnSpade.style.opacity = 1;
            concreteLoaded = true;
            arrow.classList.add("active");
            spade.classList.add("interactive");
        }, 1800);
    }
    else if (concreteLoaded && !secondSpadeClick) {
        secondSpadeClick = true;
        setInstruction(8);
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        const dims = getStageDimensions();
        moveTogether(dims.width * -0.3485, dims.height * 0.397, 900, () => {
            dropConcrete(dims.height * 0.214, 500);
            setTimeout(() => {
                moveTogether(0, 0, 900, () => { resetSpadeToCSS(concreteOnSpade); });
            }, 600);
        });
    }
    else if (readyForShake && !readyForFinalCarry) {
        readyForShake = false;
        setInstruction(9); 
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        spade.classList.add("shaking");
        setTimeout(() => {
            spade.classList.remove("shaking");
            concreteOnSpade3.style.opacity = 1;
            readyForFinalCarry = true;
            arrow.classList.add("active");
            spade.classList.add("interactive");
        }, 1200);
    }
    else if (readyForFinalCarry) {
        readyForFinalCarry = false;
        setInstruction(10); 
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        const dims = getStageDimensions();
        moveTogether(dims.width * -0.3485, dims.height * 0.397, 900, () => {
            dropConcrete3(dims.height * 0.236, 500);
            setTimeout(() => {
                moveTogether(0, 0, 900, () => { resetSpadeToCSS(concreteOnSpade3); }, "final");
            }, 600);
        }, "final");
    }
    else if (readyForShake6 && !readyForFinalCarry6) {
        readyForShake6 = false;
        setInstruction(11);
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        spade.classList.add("shaking");
        setTimeout(() => {
            spade.classList.remove("shaking");
            concreteOnSpade6.style.opacity = 1;
            readyForFinalCarry6 = true;
            arrow.classList.add("active");
            spade.classList.add("interactive");
        }, 1200);
    }
    else if (readyForFinalCarry6) {
        readyForFinalCarry6 = false;
        setInstruction(12);
        arrow.classList.remove("active");
        spade.classList.remove("interactive");
        const dims = getStageDimensions();
        moveTogether(dims.width * -0.3485, dims.height * 0.397, 900, () => {
            dropConcrete6(dims.height * 0.236, 500);
            setTimeout(() => {
                moveTogether(0, 0, 900, () => { resetSpadeToCSS(concreteOnSpade6); }, "six");
            }, 600);
        }, "six");
    }
});

// LEVELER CLICK
leveler.addEventListener("click", () => {
    if (levelerReady) {
        levelerArrow.classList.remove("active");
        levelerReady = false;
        leveler.classList.remove("interactive");
        leveler.classList.add("working");

        setTimeout(() => {
            leveler.classList.add("active");
            setTimeout(() => {
                leveler.classList.remove("active");
                leveler.classList.remove("working");
                setTimeout(() => { leveler.style.opacity = 0; }, 1000);

                if (currentLevelingPhase === 1) {
                    concreteInCone.style.opacity = 0;
                    concreteInCone2.style.opacity = 1;
                    readyForShake = true;
                    setInstruction(9); 
                    arrow.classList.add("active");
                    spade.classList.add("interactive");
                } 
                else if (currentLevelingPhase === 2) {
                    concreteInCone2.style.opacity = 0;
                    concreteInCone4.style.opacity = 1;
                    setTimeout(() => {
                        concreteInCone4.style.opacity = 0;
                        concreteInCone5.style.opacity = 1;
                        readyForShake6 = true;
                        setInstruction(11); 
                        arrow.classList.add("active");
                        spade.classList.add("interactive");
                    }, 500);
                }
                currentLevelingPhase = 0;
            }, 12500);
        }, 1000);
    }
});

levelerHigh.addEventListener("click", () => {
    if (levelerHighReady) {
        levelerArrow.classList.remove("active");
        levelerHighReady = false;
        levelerHigh.classList.remove("interactive");
        levelerHigh.classList.add("working");

        setTimeout(() => {
            levelerHigh.classList.add("active");
            setTimeout(() => {
                levelerHigh.classList.remove("active");
                levelerHigh.classList.remove("working");
                concreteInCone10.style.opacity = 0;
                concreteInCone11.style.opacity = 1;
                testCompleted = true;
                setInstruction(13); 
                
                // *** UNLOCK NEXT BUTTON HERE ***
                // The manual test is done, user must click Next to proceed to cleanup
                unlockNextBtn();

                setTimeout(() => { levelerHigh.style.opacity = 0; }, 1000);
            }, 12500);
        }, 1000);
    }
});

// ANIMATIONS (moveTogether, dropConcrete, etc)
function moveTogether(dx, dy, duration, callback, concrete = "initial") {
    const startTime = performance.now();
    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const x = dx * progress; const y = dy * progress;
        spade.style.left = spadeStart.left + x + "px";
        spade.style.bottom = spadeStart.bottom + y + "px";
        let activeConcrete = null; let startPos = null;
        if (concrete === "initial") { activeConcrete = concreteOnSpade; startPos = concreteStart; }
        else if (concrete === "final") { activeConcrete = concreteOnSpade3; startPos = concrete3Start; }
        else if (concrete === "six") { activeConcrete = concreteOnSpade6; startPos = concrete6Start; }
        else if (concrete === "nine") { activeConcrete = concreteOnSpade9; startPos = concrete9Start; }
        if (activeConcrete && startPos) { activeConcrete.style.left = startPos.left + x + "px"; activeConcrete.style.bottom = startPos.bottom + y + "px"; }
        if (progress < 1) requestAnimationFrame(animate); else if (callback) callback();
    }
    requestAnimationFrame(animate);
}

function dropConcrete(dy, duration) {
    const startTime = performance.now();
    const startBottom = parseInt(getComputedStyle(concreteOnSpade).bottom);
    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        concreteOnSpade.style.bottom = startBottom - dy * progress + "px";
        if (progress < 1) requestAnimationFrame(animate); else {
            concreteOnSpade.style.opacity = 0; concreteInCone.style.opacity = 1;
            setTimeout(() => {
                currentLevelingPhase = 1; levelerReady = true; leveler.style.opacity = 1; 
                leveler.classList.add("interactive"); levelerArrow.classList.add("active");
            }, 500);
        }
    }
    requestAnimationFrame(animate);
}

function dropConcrete3(dy, duration) {
    const startTime = performance.now();
    const startBottom = parseInt(getComputedStyle(concreteOnSpade3).bottom);
    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        concreteOnSpade3.style.bottom = startBottom - dy * progress + "px";
        if (progress < 1) requestAnimationFrame(animate); else {
            concreteOnSpade3.style.opacity = 0; concreteInCone2.style.opacity = 0; concreteInCone4.style.opacity = 1; 
            setTimeout(() => {
                currentLevelingPhase = 2; levelerReady = true; leveler.style.opacity = 1;
                leveler.classList.add("interactive"); levelerArrow.classList.add("active");
            }, 500);
        }
    }
    requestAnimationFrame(animate);
}

function dropConcrete6(dy, duration) {
    const startTime = performance.now();
    const startBottom = parseInt(getComputedStyle(concreteOnSpade6).bottom);
    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        concreteOnSpade6.style.bottom = startBottom - dy * progress + "px";
        if (progress < 1) requestAnimationFrame(animate); else {
            concreteOnSpade6.style.opacity = 0; leveler.style.opacity = 0; concreteInCone8.style.opacity = 0; concreteInCone10.style.opacity = 1;
            levelerHigh.style.opacity = 1;
            setTimeout(() => { levelerHighReady = true; levelerHigh.classList.add("interactive"); levelerArrow.classList.add("active"); }, 500);
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { updatePositions(); updateConcrete3Positions(); updateConcrete6Positions(); updateConcrete9Positions(); });
window.addEventListener('load', () => { updatePositions(); updateConcrete3Positions(); updateConcrete6Positions(); updateConcrete9Positions(); });

function showTimeInput() {
    const box = document.getElementById("instructionsBox");
    
    // Inject HTML directly into the yellow box
    box.innerHTML = `
        <span style="font-size: 1.5cqw; font-weight: 700;">Note the time: </span>
        <input type="text" id="timeInput" maxlength="4" autocomplete="off">
        <span style="font-size: 1.5cqw; font-weight: 700;"> sec</span>
        <button id="submitTime" style="margin-left:10px; padding:2px 8px; font-size:1.2cqw; cursor:pointer; background:#333; color:white; border:none; border-radius:4px;">OK</button>
    `;

    // Focus the input immediately
    const input = document.getElementById("timeInput");
    const btn = document.getElementById("submitTime");
    
    if(input) input.focus();

    // Handle Submit
    btn.onclick = function() {
        const val = input.value;
        if(val.trim() !== "") {
            // Clear HTML and show completion text
            box.innerHTML = ""; 
            setInstruction(18); // "Test Completed"
        }
    };
}