import { mount } from '@vue/test-utils';
import SearchBar from '@/components/SearchBar';

describe('SearchBar (Unit)', () => {
  it('should mount the component', () => {
    const wrapper = mount(SearchBar);
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit doSearch on form submission', async () => {
    const wrapper = mount(SearchBar);
    const term = 'termo para busca';
    await wrapper.find('input[type="search"]').setValue(term);
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted().doSearch).toBeTruthy();
    expect(wrapper.emitted().doSearch.length).toBe(1);
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term }]);
  });

  it('should emit doSearch on input clear', async () => {
    const wrapper = mount(SearchBar);
    const term = 'termo para busca';
    const input = await wrapper.find('input[type="search"]');

    await input.setValue(term);
    await input.setValue('');

    expect(wrapper.emitted().doSearch).toBeTruthy();
    expect(wrapper.emitted().doSearch.length).toBe(1);
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term: '' }]);
  });
});
