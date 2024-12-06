import { Event } from '../types/Event';

interface LoadRunnerTest {
  run_id: number;
  name: string;
  ui_status: string;
  trigger_start_time: string;
  duration: string;
  test_run_user: string;
  create_by: string;
  loadtestbegintime: string;
  loadtestendtime: string;
  api_vusers_num: number;
  total_count: string;
}

export function convertLoadRunnerTests(tests: LoadRunnerTest[]): Event[] {
  return tests.map(test => ({
    id: crypto.randomUUID(),
    title: test.name.replace(/_/g, ' '),
    description: `Run by: ${test.test_run_user}\nCreated by: ${test.create_by}\nVirtual Users: ${test.api_vusers_num}\nTotal Count: ${test.total_count}`,
    startDate: new Date(parseInt(test.loadtestbegintime)),
    endDate: new Date(parseInt(test.loadtestendtime)),
    lane: 'Performance Test',
    sentiment: 'neutral',
    links: [],
    tags: ['loadrunner', `vusers-${test.api_vusers_num}`],
  }));
}