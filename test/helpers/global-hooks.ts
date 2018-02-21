import ws from '../../src/ws';
import { getDb } from '../../src/db/utils';

after(() => {
  return getDb().then(db => {
    db.shutdown();
    let socketManager = ws();
    if (socketManager) {
      socketManager.close();
    }
  });
});
