/**
 * 延迟指定毫秒数
 * @param ms 毫秒数
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep;
