export default class Greeter {
	getName() {
		return 'friendly neighbor';
	}

	sayHello () {
		return `Hello, ${ this.getName() }!`;
	}

	async sayGoodbye () {
		await new Promise( resolve => setTimeout( resolve, 1000 ) );

		return `Goodbye, ${ this.getName() }!`;
	}
}
