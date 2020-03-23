import Papa from 'papaparse';
import PropTypes from 'prop-types';

import { EntityPT } from '../domain';
import csvPath from '../../local/local_copy-of-3dprinter.csv'; // CSV export of google sheet with same name
// import csvPath from '../../local/local_copy-of-3dprinter-small-subset.csv'; // CSV export of google sheet with same name

/**
 * Fetch data and transforms to format used in app
 */
const getData = async () => {
  //
  // fetch and parse
  //
  const parseResult = await new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      complete: function(results) {
        resolve(results);
      }
    });
  });
  // TODO error handling

  //
  // transform
  //
  const { data: sheetData } = parseResult;

  // const header = sheetData[0];
  // console.log('header: ', header);

  const data = [];

  for (let i = 1; i < sheetData.length; ++i) {
    const rowData = sheetData[i];

    const equipment = {
      model: rowData[8],
      misc_details: rowData[11],
      quantity: 1,
    };

    const site = {
      equipments: [equipment],
      city: rowData[3],
      country: rowData[4],
      lat: parseFloat(rowData[12]),
      lng: parseFloat(rowData[13]),
    };

    const entity = {
      name: rowData[2],
      sites: [site],
      entity_type: '3D-printer',
    };

    PropTypes.checkPropTypes(EntityPT, entity);

    data.push(entity);
  }

  return data;
};

export default getData;
