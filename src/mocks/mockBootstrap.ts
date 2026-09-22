const MOCK_DATA_VERSION = "mbfi-demo-v2";
const VERSION_KEY = "mock_data_version";

if (localStorage.getItem(VERSION_KEY) !== MOCK_DATA_VERSION) {
  const demoKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("mock_") || key === "proposals_db"
  );
  demoKeys.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION);
}
