//const NEW = 1

export default {
	toTitleCase(str) {
		str = str.toLowerCase().split(' ');
		for (var i = 0; i < str.length; i++) {
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
		}
		return str.join(' ');
	},

	docStatusCaption(docStatus){
		if(docStatus != undefined){
			if(docStatus == 1 || docStatus == '1'){
				return 'New';
			}else if(docStatus == 2 || docStatus == '2'){
				return 'Revise';
			}else if(docStatus == 8 || docStatus == '8'){
				return 'Posted';
			}else if(docStatus == 9 || docStatus == '9'){
				return 'Deleted';
			}else if(docStatus == 10 || docStatus == '10'){
				return 'Process';
			}else if(docStatus == 31 || docStatus == '31'){
				return 'Approved';
			}else if(docStatus == 33 || docStatus == '33'){
				return 'Disapproved';
			}else if(docStatus == 55 || docStatus == '55'){
				return 'Void';
			}else if(docStatus == 44 || docStatus == '44'){
				return 'Cancel';
			}else if(docStatus == 80 || docStatus == '80'){
				return 'Closed';
			}else if(docStatus == 20 || docStatus == '20'){
				return 'Open';
			}else if(docStatus == 21 || docStatus == '21'){
				return 'Submit';
			}else if(docStatus == 200 || docStatus == '200'){
				return 'Confirm';
			}else if(docStatus == 408 || docStatus == '408'){
				return 'Expire';
			}else if(docStatus == 210 || docStatus == '210'){
				return 'Complete';
			}else{
				return '---';
			}
		}else{
			return '--NA--';
		}		
	},

	docStatus(docStatusCaption){
		if(docStatusCaption != undefined){
			if(docStatusCaption.toLowerCase() == 'new'){
				return 1;
			}else if(docStatusCaption.toLowerCase() == 'revise'){
				return 2;
			}else if(docStatusCaption.toLowerCase() == 'posted'){
				return 8 ;
			}else if(docStatusCaption.toLowerCase() == 'deleted'){
				return 9;
			}else if(docStatusCaption.toLowerCase() == 'process'){
				return 10;
			}else if(docStatusCaption.toLowerCase() == 'approved'){
				return 31;
			}else if(docStatusCaption.toLowerCase() == 'disapproved'){
				return 33;
			}else if(docStatusCaption.toLowerCase() == 'void'){
				return 55;
			}else if(docStatusCaption.toLowerCase() == 'closed'){
				return 80;
			}else if(docStatusCaption.toLowerCase() == 'cancel'){
				return 44;
			}else if(docStatusCaption.toLowerCase() == 'open'){
				return 20;
			}else if(docStatusCaption.toLowerCase() == 'submit'){
				return 21;
			}else if(docStatusCaption.toLowerCase() == 'confirm'){
				return 200;
			}else if(docStatusCaption.toLowerCase() == 'expire'){
				return 408;
			}else if(docStatusCaption.toLowerCase() == 'complete'){
				return 210;
			}else{
				return 0;
			}
		}else{
			return 0;
		}		
	},
	
	docStatusColor(docStatusColor){
		if(docStatusColor != undefined){
			if(docStatusColor == 8 || docStatusColor == '8'){
				return 'blue';
			}else if(docStatusColor == 21 || docStatusColor == '21'){
				return 'blue';
			}else if(docStatusColor == 31 || docStatusColor == '31'){
				return 'green';
			}else if(docStatusColor == 33 || docStatusColor == '33'){
				return 'red';
			}else if(docStatusColor == 2 || docStatusColor == '2'){
				return 'warning';
			}else{
				return 'light';
			}
		}else{
			return '--NA--';
		}		
	},

//== Transaction Type START ==//
	trxModuleCaption(trxModule){
		if(trxModule != undefined){
			if(trxModule == 1 || trxModule == '1'){
				return 'PAYABLE'
			}else if(trxModule == 2 || trxModule == '2'){
				return 'RECEIVABLE'
			}else if(trxModule == 3 || trxModule == '3'){
				return 'CHECKBOOK'
			}else if(trxModule == 4 || trxModule == '4'){
				return 'GENERAL JOURNAL'
			}else if(trxModule == 5 || trxModule == '5'){
				return 'ASSET'
			}else if(trxModule == 6 || trxModule == '6'){
				return 'INVENTORY'
			}else if(trxModule == 7 || trxModule == '7'){
				return 'PAYMENT'
			}else if(trxModule == 8 || trxModule == '8'){
				return 'RECEIPT'
			}else if(trxModule == 9 || trxModule == '9'){
				return 'APPLY PAYABLE'
			}else if(trxModule == 10 || trxModule == '10'){
				return 'APPLY RECEIPT'
			}else if(trxModule == 11 || trxModule == '11'){
				return 'BANK RECONCILE'
			}else if(trxModule == 12 || trxModule == '12'){
				return 'SHIPPING'
			}else if(trxModule == 13 || trxModule == '13'){
				return 'CONTAINER RENT'
			}else{
				return '---';
			}
		}else{
			return '--NA--';
		}
	},

	trxModule(trxModuleCaption){
		if(trxModuleCaption != undefined){
			if(trxModuleCaption.toLowerCase() == 'payable'){
				return 1;
			}else if(trxModuleCaption.toLowerCase() == 'receivable'){
				return 2;
			}else if(trxModuleCaption.toLowerCase() == 'checkbook'){
				return 3;
			}else if(trxModuleCaption.toLowerCase() == 'general journal'){
				return 4;
			}else if(trxModuleCaption.toLowerCase() == 'asset'){
				return 5;
			}else if(trxModuleCaption.toLowerCase() == 'inventory'){
				return 6;
			}else if(trxModuleCaption.toLowerCase() == 'payment'){
				return 7;
			}else if(trxModuleCaption.toLowerCase() == 'receipt'){
				return 8;
			}else if(trxModuleCaption.toLowerCase() == 'apply payable'){
				return 9;
			}else if(trxModuleCaption.toLowerCase() == 'apply receipt'){
				return 10;
			}else if(trxModuleCaption.toLowerCase() == 'bank reconcile'){
				return 11;
			}else if(trxModuleCaption.toLowerCase() == 'shipping'){
				return 12;
			}else if(trxModuleCaption.toLowerCase() == 'container rent'){
				return 13;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	},
//== Transaction Type END ==//
}
