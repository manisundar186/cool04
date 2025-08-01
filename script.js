// Ensure page starts at top on reload
window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader-screen").style.display = "none";
    document.getElementById("intro-screen").style.display = "flex";
    // Optionally trigger your intro animation here
  }, 4000); // adjust duration if needed
});

// Force scroll to top immediately
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);

// Question and answer pairs
const questionAnswerPairs = [
  {
    question: "What music feels just right to HR? 🎺",
    answer: "Any track where everyone's in harmony. 🕺",
    button: "That was deep ☺️",
  },
  {
    question: "Why don’t HRs ever panic? 🧘‍♀️",
    answer: "Because they’ve seen everything and scheduled it too. 📆",
    button: "Makes sense 😂",
  },
  {
    question: "What's better than a holiday at work? 🏖️",
    answer: "A birthday celebration with the whole team! ✌️",
    button: "Absolutely! More?",
  },
  {
    question: "Why did HR get the loudest cheer on their birthday? 🎉",
    answer: "Because someone found approved leave in their inbox too! 😄",
    button: "Two wins in one day!",
  },
  {
    question: "Why are HR birthdays special? 🎊",
    answer: "Because they celebrate the person who celebrates everyone! 👩🏼‍💻",
    button: "So sweet! Next?",
  },
  {
    question: "Why did the office start calling HR a magician? 🎩",
    answer: "Because she makes problems disappear... with a smile. 😄",
    button: "Teach me your ways!",
  },
  //   {
  //     question: "Why do I smile when HR walks in? 😊",
  //     answer: "Because if you’re around, the day already feels better.",
  //     button: "Okay... that was kinda sweet 😌",
  //   },
  {
    question: "Why do people smile when they see HR walking in? 😎",
    answer: "Because if HR looks calm, the day might just be okay. 😅",
    button: "Okay, that’s true!",
  },
  {
    question: "Why do computers love HR? 💻",
    answer: "Because they never crash under pressure! 😂",
    button: "Tech-savvy! Continue?",
  },
];

// this will be added as a 1st question
const firstQuestion = {
  question: "What kind of HR schedules their birthday on a Monday? 🎉",
  answer: "The kind who turns the worst day of the week into the best one! 👩🏽",
  button: "Now that’s a flex 😄",
};

const coffeeOne = {
  question: "What do HR and coffee have in common? 🫣",
  answer: "Both keep the team running but only one smiles while doing it. 😀",
  button: "Love that one ☕",
};

// this will be added as last to enter the main content
const finalQuestion = {
  question: "Ready to blow the candles on your screen? 🕯️",
  answer: "Time for the biggest surprise of all! 🎁",
};

// Select 3 random question-answer pairs
function getRandomQuestions() {
  const shuffled = [...questionAnswerPairs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 1);
}

const selectedQuestions = getRandomQuestions();
selectedQuestions.splice(0, 1, firstQuestion); // add first question
selectedQuestions.push(coffeeOne); // add coffee question
selectedQuestions.push(finalQuestion); // add final question
let questionIndex = 0;
let isTyping = false;

const questionText = document.getElementById("question-text");
const nextBtn = document.getElementById("next-btn");
const introScreen = document.getElementById("intro-screen");
const mainContent = document.querySelector(".main-content");

// Typing effect function
function typeText(element, text, speed = 50) {
  return new Promise((resolve) => {
    element.innerHTML = "";
    let i = 0;
    isTyping = true;

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    element.appendChild(cursor);

    const timer = setInterval(() => {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
      } else {
        clearInterval(timer);
        cursor.remove();
        isTyping = false;
        resolve();
      }
    }, speed);
  });
}

// Function to append text with typing effect
function appendTypeText(element, html, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    isTyping = true;

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    element.appendChild(cursor);

    const timer = setInterval(() => {
      if (i < html.length) {
        const char = html.charAt(i);
        if (char === "<") {
          // Handle HTML tags (like <br>)
          const closeIndex = html.indexOf(">", i);
          if (closeIndex !== -1) {
            const tag = html.slice(i, closeIndex + 1);
            cursor.insertAdjacentHTML("beforebegin", tag);
            i = closeIndex + 1;
          } else {
            i++; // fail-safe
          }
        } else {
          cursor.insertAdjacentText("beforebegin", char);
          i++;
        }
      } else {
        clearInterval(timer);
        cursor.remove();
        isTyping = false;
        resolve();
      }
    }, speed);
  });
}

function getRandomPosition() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const buttonWidth = 200;
  const buttonHeight = 60;

  const padding = 20; // padding from all edges
  const rightEdgeBuffer = 40; // additional space from right
  const maxTries = 50;

  const textRect = questionText.getBoundingClientRect();

  let x,
    y,
    tries = 0;

  while (tries < maxTries) {
    // Safe X (left to viewport - button width - right buffer)
    x =
      Math.floor(
        Math.random() * (vw - buttonWidth - rightEdgeBuffer - padding)
      ) + padding;

    // Safe Y
    y = Math.floor(Math.random() * (vh - buttonHeight - padding * 2)) + padding;

    const buttonRect = {
      left: x,
      right: x + buttonWidth,
      top: y,
      bottom: y + buttonHeight,
    };

    const overlapsQuestion = !(
      buttonRect.right < textRect.left ||
      buttonRect.left > textRect.right ||
      buttonRect.bottom < textRect.top ||
      buttonRect.top > textRect.bottom
    );

    if (!overlapsQuestion) break;
    tries++;
  }

  return { x, y };
}

function animateButtonIn() {
  const animations = ["top", "bottom", "left"]; // ✅ Removed "right"
  const from = animations[Math.floor(Math.random() * animations.length)];
  const toPos = getRandomPosition();

  nextBtn.style.position = "absolute";

  let fromLeft = toPos.x;
  let fromTop = toPos.y;

  switch (from) {
    case "top":
      fromTop = -100;
      break;
    case "bottom":
      fromTop = window.innerHeight + 100;
      break;
    case "left":
      fromLeft = -200;
      break;
  }

  // Start at the "from" position
  gsap.set(nextBtn, {
    // clearProps: 'transform', // Optional but safe
    left: fromLeft,
    top: fromTop,
    opacity: 0,
  });

  // Animate to final position
  gsap.to(nextBtn, {
    left: toPos.x,
    top: toPos.y,
    opacity: 1,
    duration: 1,
    ease: "ease-in-out",
  });
}

async function showNextQuestion() {
  if (questionIndex < selectedQuestions.length) {
    const currentPair = selectedQuestions[questionIndex];

    // Hide button while typing
    gsap.to(nextBtn, { opacity: 0, duration: 0.3 });

    // Type question first
    await typeText(questionText, currentPair.question, 90);

    // Wait a bit, then append answer
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await appendTypeText(questionText, "<br><br>" + currentPair.answer, 65);

    // Update button text and show it
    if (questionIndex < selectedQuestions.length - 1) {
      nextBtn.textContent = currentPair.button;
    } else {
      nextBtn.textContent = "Let's do this! 🎉";
    }

    // Animate button back in
    setTimeout(() => {
      animateButtonIn();
    }, 500);

    questionIndex++;
  } else {
    // Show loading and then reveal main content
    gsap.to(nextBtn, { opacity: 0, duration: 0.3 });
    await typeText(
      questionText,
      "The wait is over... Here comes your surprise! ✨",
      50
    );

    setTimeout(() => {
      gsap.to("#intro-screen", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          introScreen.style.display = "none";
          document.body.classList.remove("intro-lock");
          document.documentElement.classList.remove("intro-lock"); // this is <html>
          gsap.to(mainContent, { opacity: 1, duration: 1 });
        },
      });
    }, 1200);
  }
}

// Background colors for smooth transitions
const backgroundColors = [
  { color1: "#667eea", color2: "#764ba2" },
  { color1: "#f093fb", color2: "#f5576c" },
  { color1: "#4facfe", color2: "#00f2fe" },
  { color1: "#43e97b", color2: "#24a18b" },
];

// Function to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Function to create smooth gradient transition
function createSmoothGradient(fromColors, toColors, progress) {
  const color1 = interpolateColor(fromColors.color1, toColors.color1, progress);
  const color2 = interpolateColor(fromColors.color2, toColors.color2, progress);
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

function splitTextToChars(element) {
  const text = element.textContent;
  element.textContent = "";

  const protectedWords = ["Cool", "cool"]; // Add more if needed

  text.split(" ").forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    wordSpan.style.display = "inline-block";
    wordSpan.style.marginRight = "0.3em";

    const cleanWord = word.replace(/[^a-zA-Z]/g, "");

    // If it's a protected word (e.g., "Cool"), don't split it
    if (protectedWords.includes(cleanWord)) {
      wordSpan.textContent = word;
    } else {
      Array.from(word).forEach((char) => {
        // Detect emoji using Unicode property
        const isEmoji = /\p{Emoji}/u.test(char);

        if (isEmoji) {
          const emojiSpan = document.createElement("span");
          emojiSpan.className = "emoji-char";
          emojiSpan.textContent = char;
          wordSpan.appendChild(emojiSpan);
        } else {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char;
          wordSpan.appendChild(span);
        }
      });
    }

    element.appendChild(wordSpan);

    // Add space between words
    if (wordIndex < text.split(" ").length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });
}

// Split all text elements into characters
document
  .querySelectorAll(
    ".landing-title, .landing-message, .birthday-message, .footer-text, .signature"
  )
  .forEach(splitTextToChars);

// Get all character spans
const landingTitleChars = document.querySelectorAll(".landing-title .char");
const landingMessageChars = document.querySelectorAll(".landing-message .char");
const birthdayMessageChars = document.querySelectorAll(
  ".birthday-message .char"
);
const footerTextChars = document.querySelectorAll(".footer-text .char");
const signatureChars = document.querySelectorAll(".signature .char");

const bonus1Chars = [];
const bonus2Chars = [];
splitTextToChars(document.querySelector(".bonus-section-1 .birthday-message"));
splitTextToChars(document.querySelector(".bonus-section-2 .birthday-message"));
bonus1Chars.push(...document.querySelectorAll(".bonus-section-1 .char"));
bonus2Chars.push(...document.querySelectorAll(".bonus-section-2 .char"));

// Master scroll controller for smooth background transitions
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const totalProgress = self.progress;
    let currentBg;

    if (totalProgress <= 0.2) {
      // Section 1: Pure first background
      currentBg = `linear-gradient(135deg, ${backgroundColors[0].color1} 0%, ${backgroundColors[0].color2} 100%)`;
    } else if (totalProgress <= 0.3) {
      // Transition from section 1 to section 2
      const transitionProgress = (totalProgress - 0.2) / 0.1;
      currentBg = createSmoothGradient(
        backgroundColors[0],
        backgroundColors[1],
        transitionProgress
      );
    } else if (totalProgress <= 0.5) {
      // Section 2: Pure second background
      currentBg = `linear-gradient(135deg, ${backgroundColors[1].color1} 0%, ${backgroundColors[1].color2} 100%)`;
    } else if (totalProgress <= 0.6) {
      // Transition from section 2 to section 3
      const transitionProgress = (totalProgress - 0.5) / 0.1;
      currentBg = createSmoothGradient(
        backgroundColors[1],
        backgroundColors[2],
        transitionProgress
      );
    } else if (totalProgress <= 0.85) {
      // Section 3: Pure third background
      currentBg = `linear-gradient(135deg, ${backgroundColors[2].color1} 0%, ${backgroundColors[2].color2} 100%)`;
    } else {
      // Transition to final background
      const transitionProgress = (totalProgress - 0.85) / 0.15;
      currentBg = createSmoothGradient(
        backgroundColors[2],
        backgroundColors[3],
        transitionProgress
      );
    }

    document.body.style.background = currentBg;
  },
});

// Progress bar update (separate from background)
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const progress = self.progress * 100;
    // document.querySelector('.progress-bar').style.height = progress + '%';
    if (progress > 5) {
      document.querySelector(".scroll-hint").style.opacity = "0";
    } else {
      document.querySelector(".scroll-hint").style.opacity = "1";
    }
  },
});

// Section 1: Landing Title and Message (0-20% scroll)
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "20% top",
  onUpdate: (self) => {
    const progress = self.progress;

    // Show landing section
    gsap.set(".landing-section", { opacity: progress > 0 ? 1 : 0 });

    // Reveal/hide title characters (first 50% of this section)
    const titleProgress = Math.min(progress * 2, 1);
    const titleCharsToShow = Math.floor(
      titleProgress * landingTitleChars.length
    );

    landingTitleChars.forEach((char, index) => {
      if (index < titleCharsToShow) {
        gsap.set(char, {
          opacity: 1,
          y: 0,
          rotateX: 0,
        });
      } else {
        gsap.set(char, {
          opacity: 0,
          y: 50,
          rotateX: -90,
        });
      }
    });

    // Reveal/hide message characters (second 50% of this section)
    if (progress > 0.5) {
      const messageProgress = (progress - 0.5) * 2;
      const messageCharsToShow = Math.floor(
        messageProgress * landingMessageChars.length
      );

      landingMessageChars.forEach((char, index) => {
        if (index < messageCharsToShow) {
          gsap.set(char, {
            opacity: 1,
            y: 0,
            rotateX: 0,
          });
        } else {
          gsap.set(char, {
            opacity: 0,
            y: 50,
            rotateX: -90,
          });
        }
      });
    } else {
      // Hide all message chars when scrolling up
      landingMessageChars.forEach((char) => {
        gsap.set(char, {
          opacity: 0,
          y: 50,
          rotateX: -90,
        });
      });
    }
  },
});

// Break/Transition Period (20-30% scroll)
ScrollTrigger.create({
  trigger: "body",
  start: "20% top",
  end: "30% top",
  onUpdate: (self) => {
    const progress = self.progress;

    // Fade out landing section gradually
    gsap.set(".landing-section", { opacity: 1 - progress });
  },
});

// Birthday Section Fade-In (30-40%)
ScrollTrigger.create({
  trigger: "body",
  start: "30% top",
  end: "40% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".birthday-section", { opacity: progress });
    const charsToShow = Math.floor(progress * birthdayMessageChars.length);
    birthdayMessageChars.forEach((char, index) => {
      if (index < charsToShow) {
        gsap.set(char, { opacity: 1, y: 0, rotateX: 0 });
      } else {
        gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
      }
    });
  },
});

// Fade Out Birthday Section (40-45%)
ScrollTrigger.create({
  trigger: "body",
  start: "40% top",
  end: "45% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".birthday-section", { opacity: 1 - progress });
  },
});

// Bonus Section 1 Fade-In (45-55%)
ScrollTrigger.create({
  trigger: "body",
  start: "45% top",
  end: "55% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".bonus-section-1", { opacity: progress });
    const charsToShow = Math.floor(progress * bonus1Chars.length);
    bonus1Chars.forEach((char, index) => {
      if (index < charsToShow) {
        gsap.set(char, { opacity: 1, y: 0, rotateX: 0 });
      } else {
        gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
      }
    });
  },
});

// Fade Out Bonus Section 1 (55–60%)
ScrollTrigger.create({
  trigger: "body",
  start: "55% top",
  end: "60% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".bonus-section-1", { opacity: 1 - progress });
  },
});

// Bonus Section 2 Fade-In (60–70%)
ScrollTrigger.create({
  trigger: "body",
  start: "60% top",
  end: "70% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".bonus-section-2", { opacity: progress });
    const charsToShow = Math.floor(progress * bonus2Chars.length);
    bonus2Chars.forEach((char, index) => {
      if (index < charsToShow) {
        gsap.set(char, { opacity: 1, y: 0, rotateX: 0 });
      } else {
        gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
      }
    });
  },
});

// Fade Out Bonus Section 2 (70–75%)
ScrollTrigger.create({
  trigger: "body",
  start: "70% top",
  end: "75% top",
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set(".bonus-section-2", { opacity: 1 - progress });
  },
});

// Footer Section (75–90%)
ScrollTrigger.create({
  trigger: "body",
  start: "75% top",
  end: "90% top",
  onUpdate: (self) => {
    const progress = self.progress;

    gsap.set(".footer-section", { opacity: progress });

    const footerProgress = Math.min(progress * 1.67, 1);
    const footerCharsToShow = Math.floor(
      footerProgress * footerTextChars.length
    );
    footerTextChars.forEach((char, index) => {
      if (index < footerCharsToShow) {
        gsap.set(char, { opacity: 1, y: 0, rotateX: 0 });
      } else {
        gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
      }
    });

    if (progress > 0.6) {
      const signatureProgress = (progress - 0.6) / 0.4;
      const signatureCharsToShow = Math.floor(
        signatureProgress * signatureChars.length
      );
      signatureChars.forEach((char, index) => {
        if (index < signatureCharsToShow) {
          gsap.set(char, { opacity: 1, y: 0, rotateX: 0 });
        } else {
          gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
        }
      });
    } else {
      signatureChars.forEach((char) => {
        gsap.set(char, { opacity: 0, y: 50, rotateX: -90 });
      });
    }
  },
});

// Final section: Complete experience (85-100% scroll)
ScrollTrigger.create({
  trigger: "body",
  start: "85% top",
  end: "bottom bottom",
  onUpdate: (self) => {
    // Keep footer visible
    gsap.set(".footer-section", { opacity: 1 });
  },
});

// Enhanced floating emojis animation based on scroll
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const progress = self.progress;

    document.querySelectorAll(".floating-emoji").forEach((emoji, index) => {
      const delay = (index * 0.05) % 0.3; // Staggered delays
      const emojiProgress = Math.max(0, Math.min(1, (progress - delay) * 1.5));

      // Different movement patterns for variety
      const movePattern = index % 3;
      let yMove, rotation, scale;

      switch (movePattern) {
        case 0:
          yMove = -emojiProgress * 300;
          rotation = emojiProgress * 360;
          scale = 0.8 + emojiProgress * 0.4;
          break;
        case 1:
          yMove = -emojiProgress * 200;
          rotation = emojiProgress * -180;
          scale = 0.9 + emojiProgress * 0.3;
          break;
        case 2:
          yMove = -emojiProgress * 250;
          rotation = emojiProgress * 270;
          scale = 0.7 + emojiProgress * 0.5;
          break;
      }

      gsap.set(emoji, {
        opacity: emojiProgress * 0.4, // More transparent
        y: yMove,
        rotation: rotation,
        scale: scale,
        x: Math.sin(emojiProgress * Math.PI * 2) * 20, // Subtle horizontal sway
      });
    });
  },
});

// Initial Setup
mainContent.style.opacity = 0;

// Start the first question
setTimeout(() => {
  showNextQuestion();
}, 4200);

nextBtn.addEventListener("click", (e) => {
  if (!isTyping) showNextQuestion();
});

// FIX: Ensure enough scroll space by increasing body height
document.body.style.height = "1000vh";
