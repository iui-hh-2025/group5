// quiz.js
// This script powers the "Recognizing AI" quiz: it loads questions from JSON,
// displays two images per question, checks answers, tracks score, and shows feedback.

$(function() {
  // quizData: array of question objects from JSON
  // idx: current question index
  // score: number of correct answers so far
  let quizData = [], idx = 0, score = 0;

  // total() returns the total number of questions
  const total = () => quizData.length;

  // Cache jQuery selectors for key elements
  const $qText = $('#question-text'),    // question prompt
        $img1  = $('#image1'),           // first image option
        $img2  = $('#image2'),           // second image option
        $fb    = $('#feedback'),         // feedback text (correct/incorrect)
        $nextA = $('#next-btn-area'),    // container for Next button
        $next  = $('#next-btn');         // Next button

  /**
   * loadQ(i)
   * Load question number i:
   *  - clear previous feedback
   *  - hide Next button
   *  - remove any "selected" highlight on images
   *  - update question text (with numbering)
   *  - set image src attributes
   */
  function loadQ(i) {
    const q = quizData[i];
    $fb.addClass('hidden').text('');
    $nextA.addClass('hidden');
    $img1.add($img2).removeClass('selected');
    $qText.text(`${q.question} (Question ${i+1} of ${total()})`);
    $img1.attr('src', q.image1);
    $img2.attr('src', q.image2);
  }

  /**
   * answer(chosen)
   * Check whether the user's choice (0 or 1) matches the correctIndex.
   *  - increment score for correct answers
   *  - display ✅ or ❌ feedback
   *  - show the Next button
   */
  function answer(chosen) {
    const correct = quizData[idx].correctIndex;
    const isCorrect = chosen === correct;
    if (isCorrect) score++;
    $fb
      .removeClass('hidden')
      .text(isCorrect ? '✅ Correct!' : '❌ Nope!');
    $nextA.removeClass('hidden');
  }

  // Handle click on the first image
  $img1.on('click', function() {
    // Only allow selection if Next isn't already visible
    if (!$nextA.is(':visible')) {
      $img2.removeClass('selected');
      $img1.addClass('selected');
      answer(0);
    }
  });

  // Handle click on the second image
  $img2.on('click', function() {
    if (!$nextA.is(':visible')) {
      $img1.removeClass('selected');
      $img2.addClass('selected');
      answer(1);
    }
  });

  // Handle click on the Next button
  $next.on('click', function() {
    idx++;
    if (idx < total()) {
      // More questions remain
      loadQ(idx);
    } else {
      // Quiz is over: display final score
      $fb
        .removeClass('hidden')
        .text(`🎉 Quiz complete! You scored ${score} of ${total()}.`);
      $nextA.addClass('hidden');
    }
  });

  // Load the quiz data from quiz-data.json (relative to HTML page)
  $.getJSON('../script/quiz-data.json', data => {
    quizData = data;
    loadQ(0);  // start with the first question
  });
});
