let expect = require("expect");
let {generateMessage} = require('./message');

describe('Generate Message', () => {
 it("should generate correct message object", ()=> {
    let from = "MDJ",
    text = "some random text"
    message = generateMessage(from, text);

    expect(typeof message.createdAt).tobe('number');
    expect(message).toMatchObject({from, text});
 });
});