import * as moment from 'moment';

export default function today() {
  return moment()
    .add(3, 'day')
    .format('YYYY-MM-DD');
}
