const hardQuestions = [
  {question: "What is the square root of 144?", answers: ["10","11","12","13"], correct: 2, funny: "Math wizard alert!"},
  {question: "What is the speed of light in vacuum?", answers: ["299,792,458 m/s","300,000,000 m/s","299,000,000 m/s","301,000,000 m/s"], correct: 0, funny: "Light-speed learning!"},
  {question: "Who developed the theory of general relativity?", answers: ["Isaac Newton","Galileo Galilei","Albert Einstein","Stephen Hawking"], correct: 2, funny: "Relatively speaking, genius!"},
  {question: "What is the atomic number of carbon?", answers: ["4","5","6","7"], correct: 2, funny: "Carbon copy of brilliance!"},
  {question: "In which year was the World Wide Web invented?", answers: ["1989","1991","1993","1995"], correct: 0, funny: "Web-slinging through history!"},
  {question: "What is the derivative of x²?", answers: ["x","2x","x²","2x²"], correct: 1, funny: "Deriving pleasure from math!"},
  {question: "Which composer wrote 'The Four Seasons'?", answers: ["Bach","Mozart","Vivaldi","Beethoven"], correct: 2, funny: "Vivaldi - music to my ears!"},
  {question: "What is the capital of Bhutan?", answers: ["Thimphu","Punakha","Paro","Jakar"], correct: 0, funny: "Thimphu-nomenal geography!"},
  {question: "What is Avogadro's number approximately?", answers: ["6.02 × 10²³","6.02 × 10²²","6.02 × 10²⁴","6.02 × 10²¹"], correct: 0, funny: "Avogadro would be proud!"},
  {question: "Which programming language was created by Guido van Rossum?", answers: ["Java","C++","Python","Ruby"], correct: 2, funny: "Python-ing the right answer!"},
  {question: "What is the longest word in the English language?", answers: ["Antidisestablishmentarianism","Pneumonoultramicroscopicsilicovolcanocanosis","Floccinaucinihilipilification","Supercalifragilisticexpialidocious"], correct: 1, funny: "Lung-busting vocabulary!"},
  {question: "In quantum mechanics, what is Schrödinger's cat?", answers: ["Dead","Alive","Both dead and alive","Neither dead nor alive"], correct: 2, funny: "Quantum-ly confusing but correct!"},
  {question: "What is the chemical formula for caffeine?", answers: ["C₈H₁₀N₄O₂","C₆H₁₂O₆","C₂H₅OH","C₈H₁₈"], correct: 0, funny: "Caffeine-ated intelligence!"},
  {question: "Which mathematician proved Fermat's Last Theorem?", answers: ["Pierre de Fermat","Andrew Wiles","Leonhard Euler","Carl Gauss"], correct: 1, funny: "Wiles of mathematical genius!"},
  {question: "What is the most abundant element in the universe?", answers: ["Helium","Oxygen","Carbon","Hydrogen"], correct: 3, funny: "H-ydrogen hero!"},
  {question: "In which layer of the atmosphere do most weather phenomena occur?", answers: ["Stratosphere","Troposphere","Mesosphere","Thermosphere"], correct: 1, funny: "Tropo-spherical thinking!"},
  {question: "What is the time complexity of quicksort in the average case?", answers: ["O(n)","O(n log n)","O(n²)","O(log n)"], correct: 1, funny: "Quick-ly sorted that out!"},
  {question: "Which planet has the most moons?", answers: ["Jupiter","Saturn","Uranus","Neptune"], correct: 1, funny: "Saturn-day night fever!"},
  {question: "What is the pH of pure water at 25°C?", answers: ["6","7","8","9"], correct: 1, funny: "Neutral-ly awesome!"},
  {question: "Who coined the term 'artificial intelligence'?", answers: ["Alan Turing","John McCarthy","Marvin Minsky","Herbert Simon"], correct: 1, funny: "AI-mazing historical knowledge!"},
  {question: "What is the Planck constant approximately?", answers: ["6.626 × 10⁻³⁴ J·s","6.626 × 10⁻³³ J·s","6.626 × 10⁻³⁵ J·s","6.626 × 10⁻³² J·s"], correct: 0, funny: "Planck you very much!"},
  {question: "Which element has the highest melting point?", answers: ["Tungsten","Carbon","Rhenium","Osmium"], correct: 0, funny: "Tungsten tough question!"},
  {question: "What is the integral of 1/x?", answers: ["x²/2","ln|x| + C","1/x²","e^x + C"], correct: 1, funny: "Integral-ly brilliant!"},
  {question: "Who discovered the double helix structure of DNA?", answers: ["Gregor Mendel","Watson & Crick","Marie Curie","Charles Darwin"], correct: 1, funny: "Double helix, double genius!"},
  {question: "What is the escape velocity from Earth?", answers: ["9.8 km/s","11.2 km/s","15.5 km/s","7.9 km/s"], correct: 1, funny: "Escaping to the stars!"},
  {question: "Which theorem states that in a right triangle, a² + b² = c²?", answers: ["Fermat's","Pythagorean","Euclidean","Newton's"], correct: 1, funny: "Pythagoras would be proud!"},
  {question: "What is the half-life of Carbon-14?", answers: ["5,730 years","11,460 years","2,865 years","8,595 years"], correct: 0, funny: "Carbon dating expert!"},
  {question: "Who wrote 'A Brief History of Time'?", answers: ["Carl Sagan","Stephen Hawking","Neil deGrasse Tyson","Brian Cox"], correct: 1, funny: "Hawking around with genius!"},
  {question: "What is the molecular formula for benzene?", answers: ["C₆H₆","C₆H₁₂","C₆H₁₄","C₆H₁₀"], correct: 0, funny: "Benzene-sational chemistry!"},
  {question: "Which algorithm is used for finding the shortest path between nodes?", answers: ["Bubble Sort","Dijkstra's","Binary Search","Quick Sort"], correct: 1, funny: "Dijkstra-cting success from complexity!"}
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = hardQuestions;
}