class ProgressBar2 {
  // startTime unit: ms
  // duration unit: ss
  constructor(target, options={}) {
    let container = $(target);

    let defaults = { class: '', type: 'detailed', startTime: 0, duration: 0 };
    let targetSettings = {
      startTime: Number(container.data('starttime')),
      duration: Number(container.data('duration')),
      type: container.data('type'),
      klass: container.data('klass')
    };
    let settings = Object.assign({}, defaults, targetSettings, options);

    this.container = container;
    this.startTime = new Date(settings.startTime);
    this.duration = settings.duration;
    this.endTime = new Date(settings.startTime + this.duration);
    this.klass = settings.klass;
    this.type = settings.type;
    this.id = 'progress-bar-' + Math.random().toString(36).substr(2, 9);
  }

  render() {
    let html = this._htmlTemplate();
    this.container.attr('id', this.id).html(html);
    let intervalId = setInterval(() => {this._update()}, 1000);
    ProgressBar.prototype.intervalIds.push(intervalId);
  }

  _update() {
    let progress = this._progress();
    if (progress > 100.001) { location.reload(); return }
    let formattedRemaingTime = this._formattedRemainingTime();
    $(`#${this.id}`).find('.countdown').text(formattedRemaingTime);
    $(`#${this.id}`).find('.progress-bar').css('width', `${progress}%`);
  }

  _progress() {
    let now = new Date();
    return (now - this.startTime) / this.duration * 100;
  }

  // unit: ms
  _remainingTime() {
    let now = new Date();
    return (this.endTime - now);
  }

  _formattedRemainingTime() {
    let totalSec = (this._remainingTime() / 1000).toFixed();
    let hours = this._padNumber( Math.floor(totalSec / 3600));
    totalSec %= 3600;
    let minutes = this._padNumber(Math.floor(totalSec / 60));
    let seconds = this._padNumber(totalSec % 60);
    return `${hours}:${minutes}:${seconds}`;
  }

  _padNumber(integer) {
    return (`0${integer}`).slice(-2);
  }

  _htmlTemplate() {
    console.log(this);
    let html = '';
    switch(this.type) {
      case 'detailed':
        html = `
          <div class="progress col-sm-4 col-md-4 col-lg-4">
            <div class ="progress-bar ${this.klass}" role="progressbar" aria-valuenow="progress" aria-valuemin=0 aria-valuemax= 100 style="width: ${this._progress()}%"></div>
          </div>
          <div class="col-sm-8 col-md-8 col-lg-8">
            Complete in
            <span class="countdown">
              ${this._formattedRemainingTime()}
            </span>
          </div>
        `;
        break;
      case 'simple':
        html = `
          <div class='progress progress-ultra-simple'>
            <div class="progress-bar ${this.klass}" role="progressbar" aria-valuenow="progress" aria-valuemin=0 aria-valuemax=100 style="width: ${this._progress()}%"></div>
            <span class="sr-only">${this._progress()}% Complete</span>
          </div>
        `;
        break;
    }
    return html;
  }

}

ProgressBar2.prototype.intervalIds = [];
