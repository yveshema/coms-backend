// Example lambda function for retrieving a record in a 
//dynamodb table

// import handler from "./libs/handler-lib";
// import dynamoDb from "./libs/dynamodb-lib";

// export const main = handler(async (event,context) => {
//     const params = {
//         TableName: process.env.tableName,
//         Key: {
//             userId: event.requestContext.identity.cognitoIdentityId,
//             noteId: event.pathParameters.id
//         }
//     };

//     const result = await dynamoDb.get(params);
//     if ( ! result.Item ) {
//         throw new Error("Item not found.");
//     }

//     const allocations = [];
//     while(true){
//         allocations.concat(Array(4096000).fill(1));
//     }
//     return result.Item;
// });