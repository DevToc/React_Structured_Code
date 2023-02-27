# ImageWidget Changelog

### Version 2

- Opacity option added into the ImageWidget toolbar.
- The opacity impacts the current Image's rect, same as frame and crop.
- Opacity will be stored as a number with a range between 0 and 1, but we show the option as percentage, so in the `OpacityOption.tsx` we multiply it by 100, but inside `ImageWidget.tsx` we show it as 0-1.


