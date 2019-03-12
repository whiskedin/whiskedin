
const MockHomePage = {

    Deck: [
        {

        },
        {

        },
        {

        }
    ],

    handleNext(currIndex) {
        let nextIndex = currIndex + 1
        if(nextIndex >= 0 && nextIndex < this.Deck.length){
            return nextIndex;
        }
    },

    handleBack(currIndex) {
        let prevIndex = currIndex - 1
        if(prevIndex >= 0 && prevIndex < this.Deck.length){
            return prevIndex;
        }
    }
}

module.exports = MockHomePage;