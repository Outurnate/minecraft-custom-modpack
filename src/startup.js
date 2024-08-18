// priority: 0

StartupEvents.registry("item", event =>
{
	event.create("wang");
});

MoreJSEvents.registerPotionBrewing((event) =>
{
  event.addPotionBrewing("biomesoplenty:clover", "minecraft:luck");
});