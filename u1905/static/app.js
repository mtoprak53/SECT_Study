console.log("JS is here!!");

$timer = $('#timer');
$form = $('#word-form');
$input = $("#word-input");
$list = $('#word-list-2');
$msg = $("#message");
$score = $('#score');
$playCount = $('#play-count');
$highScore = $('#high-score');
$timer = $('#timer');
$clearHistory = $('#clear-history');

class Game {
  constructor(countDown) {
    this.countDown = +countDown;
    this.score = 0;
    this.highScore;
    this.playCount;
    this.word;
    this.runTimer;

    this.url = "http://127.0.0.1:5000"

    this.numsDict = {
      high_score: this.highScore,
      play_count: this.playCount
    };

    // bound callbacks
    this.boundAddWord = this.addWord.bind(this);
    this.boundClearHistory = this.clearHistory.bind(this);
    this.boundTimerStop = this.timerStop.bind(this);
    this.boundMyTimer = this.myTimer.bind(this);
    
  }

  updateHtml() {
    $highScore.text(this.highScore);
    $playCount.text(this.playCount);
  }

  async getNumbersFromBackend() {
    const res = await axios.post(`${this.url}/send-numbers`, this.numsDict);  
    this.highScore = res.data.highScore;
    this.playCount = res.data.playCount;
    this.updateHtml();
  }  

  async sendNumbersToBackend() {
    this.numsDict = {
      high_score: this.highScore,
      play_count: this.playCount
    };
    const res = await axios.post(`${this.url}/get-numbers`, this.numsDict);
    this.updateHtml();
  }

  // ADD-WORD EVENT CALLBACK
  async addWord(event) {
    event.preventDefault();
    this.word = $input.val();

    // AJAX
    const res = await axios.get( `${this.url}/add-word`,
                                 { params: { word: this.word } } );

    const howIsTheWord = res.data.result;

    const wordStatus = {
      'ok': `The word "${this.word}" is on the board.`,
      'not-on-board': `The word "${this.word}" is not on the board!`,
      'not-word': `"${this.word}" is not a valid word!`,
    };
    $msg.text(wordStatus[howIsTheWord]);

    // CHECK IF THE WORD IS VALID & IN THE TABLE
    if (howIsTheWord == 'ok') {

      // ADD THE WORD TO THE LIST
      $list.append($("<li></li>").text(this.word));

      // UPDATE THE SCORE
      this.score += this.word.length;
      $score.text(this.score);
    }

    // CLEAR THE INPUT
    $input.val('');    
  };  

  // CLEAR-HISTORY EVENT CALLBACK
  async clearHistory() {
    const res = await axios.post(`${this.url}/clear-history`);  
    this.highScore = res.data.highScore;
    this.playCount = res.data.playCount;
    this.updateHtml();
  };

  timerStop() {
    clearInterval(this.runTimer);
    $form.hide();
    $clearHistory.show();
    if (this.score > this.highScore) {
      this.highScore = this.score;
    };
    this.playCount++;
    this.sendNumbersToBackend();
  };

  myTimer() {
    if(this.countDown <= 0) {this.boundTimerStop()};
    $timer.text(this.countDown);
    this.countDown--;
  };

  // MAIN GAME FLOW
  async play() {
    $clearHistory.hide();
    await this.getNumbersFromBackend();
    this.runTimer = setInterval(this.boundMyTimer, 1000);
    $form.on('submit', this.boundAddWord);
    $clearHistory.on('click', this.boundClearHistory);
  }
}

const myGame = new Game(30);
myGame.play();