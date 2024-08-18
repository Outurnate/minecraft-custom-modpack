// priority: 0

const disabledItems = [
  "farmersdelight:rope",
	"quark:rope"
];

// TODO
// title screen?
// quests?
// fix item hiding
// DONE: loot fix emeralds
// DONE: loot fix ropes
// hide relics
// DONE: get rid of hammer lib and midnight lib extra junk
// maybe a bit more structure gen?  train tracks in the wasteland?
// DONE: add electrum recipe
// backups
// optional client tools
// DONE: more maps per map
// DONE: dragon's breath
// DONE: cloud connected
// DONE: unify spooled wires
// DONE: better new age textures
// coe thorium
// add tetra

// tenets
// no teleportation - make travel worth doing and fun.  sky and sea travel are big
// focus on create - don't make it obsolete in late game
// not vanilla+ - depart from it, but don't make it a different game
// trying to focus on providing a challenge to do while decorating

const stack_of_coins = 4;
const copper_to_gold = 4 * stack_of_coins;
const gold_to_netherite = 4 * stack_of_coins;

ServerEvents.tags("entity_type", event =>
{
  event.add("supplementaries:cage_catchable", "alexsmobs:terrapin");
  event.add("supplementaries:cage_catchable", "alexsmobs:skunk");
  event.add("supplementaries:cage_catchable", "alexsmobs:leafcutter_ant");
  event.add("supplementaries:cage_catchable", "alexsmobs:blue_jay");
  event.add("supplementaries:cage_catchable", "alexsmobs:banana_slug");
  event.add("supplementaries:cage_catchable", "minecraft:silverfish");
  event.add("supplementaries:cage_catchable", "create_confectionery:little_gingerbread_man");

  event.add("supplementaries:cage_baby_catchable", "minecraft:villager"); // i'm not sorry
});

ServerEvents.tags("item", event =>
{
	event.remove("forge:dough", "farmersdelight:wheat_dough");

  event.remove("supplementaries:ropes", "farmersdelight:rope");
	event.remove("supplementaries:ropes", "quark:rope");

	event.add("supplementaries:straw", "biomesoplenty:reed");
	event.add("supplementaries:straw", "biomesoplenty:watergrass");

	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:backpack");
	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:copper_backpack");
	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:iron_backpack");
	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:gold_backpack");
	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:diamond_backpack");
	event.add("supplementaries:shulker_blacklist", "sophisticatedbackpacks:netherite_backpack");

  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:backpack");
  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:copper_backpack");
  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:iron_backpack");
  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:gold_backpack");
  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:diamond_backpack");
  event.add("supplementaries:overencumbering", "sophisticatedbackpacks:netherite_backpack");

  event.add("createaddition:plant_foods", "farmersdelight:tomato");
  event.add("createaddition:plant_foods", "farmersdelight:cabbage");
  event.add("createaddition:plant_foods", "farmersdelight:onion");
  event.add("createaddition:plant_foods", "farmersdelight:rice_panicle");

  event.add("custom_compat:glowy_things", "minecraft:glow_ink_sac");
  event.add("custom_compat:glowy_things", "biomesoplenty:glowworm_silk");
  event.add("custom_compat:glowy_things", "biomesoplenty:glowshroom");

  event.add("curios:charm", "toms_storage:ts.adv_wireless_terminal");
  const lanterns = Ingredient.of(/.*lantern.*/);
  event.get("curios:belt").getObjectIds().forEach((item) =>
  {
    if (lanterns.test(item))
      event.add("curios:charm", item);
  });
});

ServerEvents.recipes(event =>
{
  // remove
  disabledItems.forEach(item => event.remove({output: item}));

  // edit recipes
  event.replaceInput({input: "minecraft:glow_ink_sac"}, "minecraft:glow_ink_sac", "#custom_compat:glowy_things");
  event.replaceInput({input: "farmersdelight:straw", output: "farmersdelight:organic_compost"}, "farmersdelight:straw", "#supplementaries:straw");
  //event.replaceInput({input: "#forge:dough"}, "#forge:dough", "create:dough");

  // remove and replace recipe
  event.remove({output: "sophisticatedbackpacks:stack_upgrade_tier_4"});
  event.smithing("sophisticatedbackpacks:stack_upgrade_tier_4", "sophisticatedbackpacks:stack_upgrade_tier_3", "minecraft:netherite_ingot");
});

function adjustCost(emeralds)
{
  const emeralds_to_copper = 4;

  var quantity = Math.pow(emeralds, 1.5) * emeralds_to_copper;
  var type = "createdeco:copper_coin";
  if (quantity > 64)
  {
    quantity = quantity / copper_to_gold;
    type = "createdeco:gold_coin";
    if (quantity > 64)
    {
      quantity = quantity / gold_to_netherite;
      type = "createdeco:netherite_coin";
    }
  }

  return [Math.round(quantity), type];
}

function tweakOffer(newOffer, oldOffer)
{
  if (oldOffer.getFirstInput().getId() == "minecraft:emerald")
  {
    let quantity, type;
    [quantity, type] = adjustCost(oldOffer.getFirstInput().getCount());
    oldOffer.setFirstInput(type);
    oldOffer.getFirstInput().setCount(quantity);
  }
  if (oldOffer.getSecondInput().getId() == "minecraft:emerald")
  {
    let quantity, type;
    [quantity, type] = adjustCost(oldOffer.getSecondInput().getCount());
    oldOffer.setSecondInput(type);
    oldOffer.getSecondInput().setCount(quantity);
  }
  if (oldOffer.getOutput().getId() == "minecraft:emerald")
  {
    let quantity, type;
    [quantity, type] = adjustCost(oldOffer.getOutput().getCount());
    oldOffer.setOutput(type);
    oldOffer.getOutput().setCount(quantity);
  }

  newOffer.setFirstInput(oldOffer.getFirstInput());
  newOffer.setSecondInput(oldOffer.getSecondInput());
  newOffer.setOutput(oldOffer.getOutput());
  newOffer.setMaxUses(oldOffer.getMaxUses());
  newOffer.setVillagerExperience(oldOffer.getXp());
  newOffer.setPriceMultiplier(oldOffer.getPriceMultiplier());
}

MoreJSEvents.wandererTrades((event) =>
{
  [1, 2].forEach((level) =>
  {
    const trades = VillagerUtils.getWandererTrades(level);
    event.removeVanillaTrades(level);
    event.removeModdedTrades(level);
    trades.forEach((trade) =>
    {
      try
      {
        event.addCustomTrade(level, (offer, entity, random) =>
        {
          tweakOffer(offer, trade.getOffer(entity, random));
        });
      }
      catch (error)
      {
        console.error(error);
      }
    });
  });
});

MoreJSEvents.villagerTrades((event) =>
{
  const professions =
  [
    "minecraft:armorer",
    "minecraft:butcher",
    "minecraft:cartographer",
    "minecraft:cleric",
    "minecraft:farmer",
    "minecraft:fisherman",
    "minecraft:fletcher",
    "minecraft:leatherworker",
    "minecraft:librarian",
    "minecraft:mason",
    "minecraft:shepherd",
    "minecraft:toolsmith",
    "minecraft:weaponsmith",
    "domesticationinnovation:animal_tamer",
    "dynamicvillage:mechanical_engineer",
    "dynamicvillage:hydraulic_engineer",
    "dynamicvillage:train_mechanic",
    "dynamicvillage:miner"
  ];
  professions.forEach((profession) =>
  {
    [1, 2, 3, 4, 5].forEach((level) =>
    {
      const trades = VillagerUtils.getVillagerTrades(profession, level);
      event.removeVanillaTrades(profession, level);
      event.removeModdedTrades(profession, level);
      trades.forEach((trade) =>
      {
        try
        {
          event.addCustomTrade(profession, level, (offer, entity, random) =>
          {
            tweakOffer(offer, trade.getOffer(entity, random));
          });
        }
        catch (error)
        {
          console.error(error);
        }
      });
    });
  });

  const trade_arrow_quiver = event.addTrade("minecraft:fletcher", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:arrow_quiver");
  trade_arrow_quiver.maxUses(1);
  trade_arrow_quiver.villagerExperience(40);
  trade_arrow_quiver.priceMultiplier(0.05);

  const trade_horse_flute = event.addTrade("minecraft:cartographer", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:horse_flute");
  trade_horse_flute.maxUses(1);
  trade_horse_flute.villagerExperience(40);
  trade_horse_flute.priceMultiplier(0.05);

  const trade_hunter_belt = event.addTrade("minecraft:leatherworker", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:hunter_belt");
  trade_hunter_belt.maxUses(1);
  trade_hunter_belt.villagerExperience(40);
  trade_hunter_belt.priceMultiplier(0.05);

  const trade_ice_breaker = event.addTrade("minecraft:toolsmith", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:ice_breaker");
  trade_ice_breaker.maxUses(1);
  trade_ice_breaker.villagerExperience(40);
  trade_ice_breaker.priceMultiplier(0.05);

  const trade_ice_skates = event.addTrade("minecraft:armorer", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:ice_skates");
  trade_ice_skates.maxUses(1);
  trade_ice_skates.villagerExperience(40);
  trade_ice_skates.priceMultiplier(0.05);

  const trade_infinity_ham = event.addTrade("minecraft:butcher", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:infinity_ham");
  trade_infinity_ham.maxUses(1);
  trade_infinity_ham.villagerExperience(40);
  trade_infinity_ham.priceMultiplier(0.05);

  const trade_leather_belt = event.addTrade("minecraft:leatherworker", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:leather_belt");
  trade_leather_belt.maxUses(1);
  trade_leather_belt.villagerExperience(40);
  trade_leather_belt.priceMultiplier(0.05);

  const trade_roller_skates = event.addTrade("minecraft:armorer", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:roller_skates");
  trade_roller_skates.maxUses(1);
  trade_roller_skates.villagerExperience(40);
  trade_roller_skates.priceMultiplier(0.05);

  const trade_wool_mitten = event.addTrade("minecraft:shepherd", 5, [TradeItem.of("createdeco:netherite_coin", 1, 2)], "relics:wool_mitten");
  trade_wool_mitten.maxUses(1);
  trade_wool_mitten.villagerExperience(40);
  trade_wool_mitten.priceMultiplier(0.05);
});