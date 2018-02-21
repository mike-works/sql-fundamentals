import { getDb } from '../../src/db/utils';
import ws from '../../src/ws';

after(() => {
  return getDb().then(db => {
    db.shutdown();
    let socketManager = ws();
    if (socketManager) {
      socketManager.close();
    }
  });
});
