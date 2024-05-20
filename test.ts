[
  {
    data: {
      currentAdv: {
		advertiserID: "47920",
        links: [
          'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20231001/47920/VAT_47920_2126220_20231001.pdf&advertiserID=47920',
          'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20231001/47920/VAT_47920_2126220_20231001.pdf&advertiserID=47920',
        ],
      },
    },
  },
];

{
  params: {
 service:   {
     folderName: $input.first().json.country,
      parentServiceUrl: `${$input.first().json.parentFolderId}`,
    },
   year: {
      folderName: year,
      parentServiceUrl: '',
    },
   month: {
      folderName: month,
      parentServiceUrl: '',
    },
    adv: {
      folderName: el,
      parentServiceUrl: '',
    },
}
 }

 {
   servicefolder: $input.first().json.country,
   parentServiceUrl: `${$input.first().json.parentFolderId}`,
   yearFolder: year,
   monthFolder: month,
   advFolder: el
  }