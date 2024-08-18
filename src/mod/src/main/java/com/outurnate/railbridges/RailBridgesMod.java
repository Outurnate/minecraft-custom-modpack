package com.outurnate.railbridges;

import net.minecraft.world.level.levelgen.feature.Feature;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

@Mod(RailBridgesMod.MODID)
public class RailBridgesMod
{
    public static final String MODID = "railbridges";
    public static final DeferredRegister<Feature<?>> FEATURES = DeferredRegister.create(ForgeRegistries.FEATURES, MODID);
    public static final RegistryObject<TrackBridgeFeature> TRACKBRIDGE_FEATURE = FEATURES.register("trackbridge", TrackBridgeFeature::new);

    public RailBridgesMod()
    {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        FEATURES.register(modEventBus);
    }
}
