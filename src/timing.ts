class TimingManager {
  public static reset(response: any) {
    this.tm = new TimingManager(response);
  }
  public static get current(): TimingManager {
    return this.tm;
  }
  private static tm: TimingManager;

  protected response: any;
  constructor(response: any) {
    this.response = response;
  }
  public addTime(name: string, time: number, description: string) {
    (this.response as any).setMetric(name, time, description);
  }
}
export default TimingManager;
