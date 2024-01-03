const genius = function () {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  
  return {
    isPlaying: false,
    isIddle: false,
    level: 1,
    sequence: [],
    key: null,
    match: [],
    
    get display () {
      if (!this.isPlaying) return "GO 👆"
      else return `Level ${this.level}`
    },
    
    isActive (key) {
      return key === this.key ? "active" : ""
    },
    
    get randomKey () {
      const newKey = () => Math.round(Math.random() * 3)
      let key = newKey()
      
      while (this.sequence.length >= 2) {
        const index = this.sequence.length - 2
        const lastKey = this.sequence[index]

        if (key === lastKey) key = newKey()
        else break
      }
      
      return key
    },
    
    get speed () {
      return 500 / Math.sqrt(this.level)
    },
    
    async playSequence () {
      for (key of this.sequence) {
        await sleep(this.speed)
        this.key = key
        await sleep(this.speed)
        this.key = null
      }
      this.key = null
    },
    
    userInput () {
      return new Promise(resolve => {
        const loop = setInterval(() => {
          if (!this.isIddle || this.match.length === this.sequence.length) {
            clearInterval(loop)
            resolve()
          }
        }, 50)
      })
    },
    
    push (key) {
      if (!this.isIddle) return
      
      const index = this.match.length
      const lastKey = this.sequence[index]
      
      if (key === lastKey) this.match.push(key)
      else this.isIddle = false
    },
    
    async start () {
      if (this.isPlaying) return
      
      this.isPlaying = true

      while (this.isPlaying) {
        this.sequence.push(this.randomKey)
        this.match = []

        await this.playSequence()

        this.isIddle = true
        await this.userInput()
        this.isIddle = false

        if (this.match.length === this.sequence.length) {
          this.level++
          
          await sleep(1000)
        }
        else break
      }

      this.isPlaying = false
      this.isIddle = false
      this.sequence = []
      this.level = 1
    }
  }
}