// import loadComponents from './components';
// import loadBlocks from './blocks';
// import en from './locale/en';

const componentJson = {
  // type: 'div',
  // style: { margin: '20px', padding: '20px', border: '1px solid #ddd' },
  // components: [
  //   {
  //     type: 'header',
  //     components: [
  //       {
  //         type: 'h1',
  //         content: 'Leading IT Services Provider - Byteplexure',
  //         style: { color: '#333', 'margin-bottom': '10px' }
  //       },
  //       {
  //         type: 'h3',
  //         content: 'Discover Byteplexure Solutions',
  //         style: { color: '#666', 'font-weight': '300' }
  //       }
  //     ]
  //   },
  //   {
  //     type: 'section',
  //     components: [
  //       {
  //         type: 'h2',
  //         content: 'Our Expertise',
  //         style: { 'margin-top': '20px', 'margin-bottom': '10px' }
  //       },
  //       {
  //         type: 'paragraph',
  //         content: 'Byteplexure is a leading provider of IT services, offering a wide range of solutions to help businesses optimize their digital infrastructure. With expertise in cybersecurity, cloud computing, software development, and IT support, Byteplexure ensures clients stay ahead in the ever-evolving technology landscape.',
  //         style: { 'line-height': '1.6' }
  //       }
  //     ]
  //   },
  //   {
  //     type: 'section',
  //     components: [
  //       {
  //         type: 'h2',
  //         content: 'Our Services',
  //         style: { 'margin-top': '20px', 'margin-bottom': '10px' }
  //       },
  //       {
  //         type: 'ul',
  //         components: [
  //           {
  //             type: 'li',
  //             content: 'Cybersecurity',
  //             link: 'https://www.byteplexure.com/cybersecurity',
  //             style: { 'margin-bottom': '5px' }
  //           },
  //           {
  //             type: 'li',
  //             content: 'Cloud Computing Solutions',
  //             link: 'https://www.byteplexure.com/cloud-computing',
  //             style: { 'margin-bottom': '5px' }
  //           },
  //           {
  //             type: 'li',
  //             content: 'Software Development',
  //             link: 'https://www.byteplexure.com/software-development',
  //             style: { 'margin-bottom': '5px' }
  //           },
  //           {
  //             type: 'li',
  //             content: 'IT Support Services',
  //             link: 'https://www.byteplexure.com/it-support',
  //             style: { 'margin-bottom': '5px' }
  //           },
  //           {
  //             type: 'li',
  //             content: 'Innovative Solutions',
  //             link: 'https://www.byteplexure.com/innovative-solutions',
  //             style: { 'margin-bottom': '5px' }
  //           }
  //         ],
  //         style: { 'padding-left': '20px' }
  //       }
  //     ]
  //   },
  //   {
  //     type: 'section',
  //     components: [
  //       {
  //         type: 'h2',
  //         content: 'Portfolio',
  //         style: { 'margin-top': '20px', 'margin-bottom': '10px' }
  //       },
  //       {
  //         type: 'image',
  //         src: 'https://images.unsplash.com/photo-1557733686-3f8641465d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MjczNDh8MHwxfHNlYXJjaHwxfHxWaWV3JTIwb3VyJTIwY29tcGxldGVkJTIwcHJvamVjdHMlMjB0aGF0JTIwc2hvd2Nhc2UlMjBvdXIlMjBleHBlcnRpc2UlMjBhbmQlMjBjb21taXRtZW50JTIwdG8lMjBxdWFsaXR5LnxlbnwwfHx8fDE3MjU3Mzk0MzF8MA&ixlib=rb-4.0.3&q=80&w=1080',
  //         alt: 'Portfolio of Successful Projects',
  //         style: { 'margin-bottom': '20px', width: '100%' }
  //       },
  //       {
  //         type: 'paragraph',
  //         content: 'View our completed projects that showcase our expertise and commitment to quality.',
  //         style: { 'line-height': '1.6' }
  //       }
  //     ]
  //   },
  //   {
  //     type: 'footer',
  //     components: [
  //       {
  //         type: 'paragraph',
  //         content: '© 2024 Byteplexure. All rights reserved.',
  //         style: { 'margin-top': '20px', 'font-size': '0.9em', color: '#888' }
  //       }
  //     ]
  //   }
  // ]
};

// const addEditableComponent = (editor) => {
//   editor.DomComponents.addType('my-editable-component', {
//     model: {
//       defaults: {
//         ...componentJson,
//         droppable: true,
//         editable: true,
//       }
//     },
//     view: {
//       onRender({ el }) {
//         el.contentEditable = true;
//       }
//     }
//   });
// };

// export default (editor, opts = {}) => {
//   const options = { ...{
//     i18n: {},
//     // default options
//   },  ...opts };

//   // Add components
//   loadComponents(editor, options);
//   // Add blocks
//   loadBlocks(editor, options);
//   // Load i18n files
//   editor.I18n && editor.I18n.addMessages({
//       en,
//       ...options.i18n,
//   });

//   // Add the editable component
//   addEditableComponent(editor);

//   // Add the component to the canvas when the editor loads
//   editor.on('load', () => {
//     editor.addComponents({
//       type: 'my-editable-component'
//     });
//   })

  
// };

// import loadComponents from './components';
// import loadBlocks from './blocks';
// import en from './locale/en';

// // Function to fetch the component JSON dynamically
// const fetchComponentJson = async () => {
//   try {
//     const response = await fetch('http://localhost:5000/api/users/website/create',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU4MjU5ODIsImV4cCI6MTcyNTgyNjA0MiwianRpIjoiYWZlNjA3MjUtZGRlNC00MjM2LWJiYjgtOGI5MzhiNDIzNDQzIiwiaWQiOjIsInJscyI6InVzZXIiLCJyZl9leHAiOjE3MjU4MjYwNDJ9.E71YQT2eQVHojfyWNFNYjwgAHd96cNF4g-eB1VV_2SM'
//         },
//         body: JSON.stringify({
//           template: 'default'
//         })
//       }
//     ); // Use your API endpoint
//     console.log(response);
//     if (!response.ok) {
//       throw new Error('Failed to fetch component JSON');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
// const componentJson = {
//   type: 'div',
//   style: { margin: '20px', padding: '20px', border: '1px solid #ddd' },
//   components: [
//     {
//       type: 'header',
//       components: [
//         {
//           type: 'h1',
//           content: 'Leading IT Services Provider - Byteplexure',
//           style: { color: '#333', 'margin-bottom': '10px' }
//         },
//         {
//           type: 'h3',
//           content: 'Discover Byteplexure Solutions',
//           style: { color: '#666', 'font-weight': '300' }
//         }
//       ]
//     },
//     {
//       type: 'section',
//       components: [
//         {
//           type: 'h2',
//           content: 'Our Expertise',
//           style: { 'margin-top': '20px', 'margin-bottom': '10px' }
//         },
//         {
//           type: 'paragraph',
//           content: 'Byteplexure is a leading provider of IT services, offering a wide range of solutions to help businesses optimize their digital infrastructure. With expertise in cybersecurity, cloud computing, software development, and IT support, Byteplexure ensures clients stay ahead in the ever-evolving technology landscape.',
//           style: { 'line-height': '1.6' }
//         }
//       ]
//     },
//     {
//       type: 'section',
//       components: [
//         {
//           type: 'h2',
//           content: 'Our Services',
//           style: { 'margin-top': '20px', 'margin-bottom': '10px' }
//         },
//         {
//           type: 'ul',
//           components: [
//             {
//               type: 'li',
//               content: 'Cybersecurity',
//               link: 'https://www.byteplexure.com/cybersecurity',
//               style: { 'margin-bottom': '5px' }
//             },
//             {
//               type: 'li',
//               content: 'Cloud Computing Solutions',
//               link: 'https://www.byteplexure.com/cloud-computing',
//               style: { 'margin-bottom': '5px' }
//             },
//             {
//               type: 'li',
//               content: 'Software Development',
//               link: 'https://www.byteplexure.com/software-development',
//               style: { 'margin-bottom': '5px' }
//             },
//             {
//               type: 'li',
//               content: 'IT Support Services',
//               link: 'https://www.byteplexure.com/it-support',
//               style: { 'margin-bottom': '5px' }
//             },
//             {
//               type: 'li',
//               content: 'Innovative Solutions',
//               link: 'https://www.byteplexure.com/innovative-solutions',
//               style: { 'margin-bottom': '5px' }
//             }
//           ],
//           style: { 'padding-left': '20px' }
//         }
//       ]
//     },
//     {
//       type: 'section',
//       components: [
//         {
//           type: 'h2',
//           content: 'Portfolio',
//           style: { 'margin-top': '20px', 'margin-bottom': '10px' }
//         },
//         {
//           type: 'image',
//           src: 'https://images.unsplash.com/photo-1557733686-3f8641465d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MjczNDh8MHwxfHNlYXJjaHwxfHxWaWV3JTIwb3VyJTIwY29tcGxldGVkJTIwcHJvamVjdHMlMjB0aGF0JTIwc2hvd2Nhc2UlMjBvdXIlMjBleHBlcnRpc2UlMjBhbmQlMjBjb21taXRtZW50JTIwdG8lMjBxdWFsaXR5LnxlbnwwfHx8fDE3MjU3Mzk0MzF8MA&ixlib=rb-4.0.3&q=80&w=1080',
//           alt: 'Portfolio of Successful Projects',
//           style: { 'margin-bottom': '20px', width: '100%' }
//         },
//         {
//           type: 'paragraph',
//           content: 'View our completed projects that showcase our expertise and commitment to quality.',
//           style: { 'line-height': '1.6' }
//         }
//       ]
//     },
//     {
//       type: 'footer',
//       components: [
//         {
//           type: 'paragraph',
//           content: '© 2024 Byteplexure. All rights reserved.',
//           style: { 'margin-top': '20px', 'font-size': '0.9em', color: '#888' }
//         }
//       ]
//     }
//   ]
// };

// const addEditableComponent = (editor, componentJson) => {
//   editor.DomComponents.addType('my-editable-component', {
//     model: {
//       defaults: {
//         ...componentJson,
//         droppable: true,
//         editable: true,
//       }
//     },
//     view: {
//       onRender({ el }) {
//         el.contentEditable = true;
//       }
//     }
//   });
// };

// export default async (editor, opts = {}) => {
//   const options = { 
//     i18n: {},
//     ...opts 
//   };

//   // Add components
//   loadComponents(editor, options);
//   // Add blocks
//   loadBlocks(editor, options);
//   // Load i18n files
//   editor.I18n && editor.I18n.addMessages({
//       en,
//       ...options.i18n,
//   });

//   // Fetch the dynamic component JSON
//   const componentJson = await fetchComponentJson();

//   if (componentJson) {
//     // Add the editable component with the fetched JSON
//     addEditableComponent(editor, componentJson);

//     // Add the component to the canvas when the editor loads
//     editor.on('load', () => {
//       editor.addComponents({
//         type: 'my-editable-component'
//       });
//     });
//   } else {
//     console.error('Component JSON could not be fetched.');
//   }
// };

import loadComponents from './components';
import loadBlocks from './blocks';
import en from './locale/en';

// Function to fetch the component JSON dynamically from IndexedDB
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WebsiteGeneratorDB', 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
     
    };


    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('websiteData')) {
        db.createObjectStore('websiteData', { keyPath: 'id', autoIncrement: true });
        console.log('Created object store: websiteData');
      }
    };
  });
};

const getWebsiteData = async () => {
  try {
    const db = await openDatabase();

    if (db.objectStoreNames.contains('websiteData')) {
      const transaction = db.transaction(['websiteData'], 'readonly');
      const store = transaction.objectStore('websiteData');
      const request = store.getAll();
      const getAllKeysRequest = objectStore.getAllKeys();
      // const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = function() {
        console.log('Keys:', getAllKeysRequest.result); // Access the keys (from the # column)
      };
      getAllKeysRequest.onerror = function() {
      console.error('Error retrieving keys');
     };
    // const transaction = db.transaction(['websiteData'], 'readonly');
    //     const store = transaction.objectStore('websiteData');

        // // Get all keys from the object store
        // const getAllKeysRequest = store.getAllKeys();

        // getAllKeysRequest.onsuccess = function() {
        //     console.log('Keys:', getAllKeysRequest.result); // Access the keys (from the # column)
        // };

        // getAllKeysRequest.onerror = function() {
        //     console.error('Error retrieving keys');
        // };

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          //
          console.log('Website data from IndexedDB jiyan:', event.target.result[0]['apiResponse']);
          //convert the event.target.result to json
          // const json = JSON.stringify(event.target.result);
          // console.log('Website data from IndexedDB:', json);

          resolve(event.target.result); // Return the data from IndexedDB
         

        };

        request.onerror = (event) => {
          console.error('Error fetching data from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      });
    } else {
      console.error('Object store "websiteData" not found');
      return [];
    }
  } catch (error) {
    console.error('Error accessing IndexedDB:', error);
    return [];
  }
};

const addEditableComponent = (editor, componentJson) => {
  editor.DomComponents.addType('my-editable-component', {
    model: {
      defaults: {
        ...componentJson, // Use the dynamically fetched componentJson
        droppable: true,
        editable: true,
      }
    },
    view: {
      onRender({ el }) {
        el.contentEditable = true;
      }
    }
  });
};

export default async (editor, opts = {}) => {
  const options = { 
    i18n: {},
    ...opts 
  };

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
  // Load i18n files
  editor.I18n && editor.I18n.addMessages({
      en,
      ...options.i18n,
  });

  // Access the IndexedDB data when the editor loads
  editor.on('load', async () => {
    console.log("inside load event");

    // Fetch the data from IndexedDB
    const storedData = await getWebsiteData();
    
    if (storedData && storedData.length > 0) {
      console.log('Stored data retrieved:', storedData);
      
      // Assuming the first entry in IndexedDB has the componentJson you need
      const componentJson = storedData[0]['apiResponse']; 
      
      // Add the editable component with the fetched JSON
      addEditableComponent(editor, componentJson);

      // Add the component to the canvas
      editor.addComponents({
        type: 'my-editable-component'
      });
    } else {
      console.error('No data found in IndexedDB.');
    }
  });
};
