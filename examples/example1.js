import Container from 'js-container/Container';


let container = new Container();

let endpoint = 'http://endpoint';
container.set(ApiClient, [endpoint]);

container.set(TaskDatagridDatasource, [ApiClient]);
	