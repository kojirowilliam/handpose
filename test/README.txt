This was my attempt to making a hand recognition website using React and GraphQL.
From the beginning, I was trying to make this an educational research project
about learning GraphQL and React, but as I was making very slow progress and
had to finish with something, I stopped caring about the syntax and learning
about how to make everything properly and just forced my way through to have
something to show.
In short, I couldn't figure out how to create class variables for the life of
me and the internet, so I just saved data directly onto HTML labels. From there,
I was supposed to be able to save data onto the GraphQL server, but that didn't
go according to plan the first few tries so I just decided to give up saving
data and just took data from one gesture and used the euclidean formula for that.
As you may see in the code, it is a very bad implementation because I didn't
want to spend time learning about return functions and run into other kinds of
errors.
But so you can still see the interaction between the GraphQL server and the React
program, I kept the test button on the top left corner so you should still be
able to save the data and time.

HOW TO RUN THE CODE:
The main code is inside of test/button/src.

To get this working, you need to install React and then install the dependencies
inside of the package.json:
"@apollo/client": "^3.3.14",
"@tensorflow-models/handpose": "^0.0.7",
"@tensorflow/tfjs": "^3.3.0",
"@testing-library/jest-dom": "^5.11.4",
"@testing-library/react": "^11.1.0",
"@testing-library/user-event": "^12.1.10",
"apollo-boost": "^0.4.9",
"apollo-client": "^2.6.10",
"bootstrap": "^4.6.0",
"cors": "^2.8.5",
"express": "^4.17.1",
"express-graphql": "^0.12.0",
"final-form": "^4.20.2",
"graphql": "^15.5.0",
"graphql-tag": "^2.11.0",
"nodemon": "1.18.4",
"react": "^17.0.2",
"react-apollo": "^3.1.5",
"react-dom": "^17.0.2",
"react-final-form": "^6.5.3",
"react-scripts": "4.0.3",
"react-webcam": "^5.2.3",
"reactstrap": "^8.9.0",
"web-vitals": "^1.0.1"

Once you get those installed, you may need to install node to be able to get
the GraphQL server running.
Finally, to run everything you need to run "npm start" inside of your console.
