package com.outurnate.railbridges;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import net.minecraft.resources.ResourceLocation;
import net.minecraft.tags.TagKey;
import net.minecraft.util.ExtraCodecs;
import net.minecraft.util.ExtraCodecs.TagOrElementLocation;
import net.minecraft.world.level.biome.Biome;
import net.minecraft.world.level.levelgen.feature.configurations.FeatureConfiguration;
import net.minecraftforge.registries.ForgeRegistries;

public record TrackBridgeFeatureConfiguration(int chunkSeparation, float damageChance, float infiniteChance, int yLevel, TagOrElementLocation allowedBiomes) implements FeatureConfiguration {
  public static final Codec<TrackBridgeFeatureConfiguration> CODEC = RecordCodecBuilder.create((instance) -> {
    return instance.group(
      ExtraCodecs.POSITIVE_INT.fieldOf("chunkSeparation").forGetter(TrackBridgeFeatureConfiguration::chunkSeparation),
      ExtraCodecs.POSITIVE_FLOAT.fieldOf("damageChance").forGetter(TrackBridgeFeatureConfiguration::damageChance),
      ExtraCodecs.POSITIVE_FLOAT.fieldOf("infiniteChance").forGetter(TrackBridgeFeatureConfiguration::infiniteChance),
      ExtraCodecs.POSITIVE_INT.fieldOf("yLevel").forGetter(TrackBridgeFeatureConfiguration::yLevel),
      ExtraCodecs.TAG_OR_ELEMENT_ID.fieldOf("allowedBiomes").forGetter(TrackBridgeFeatureConfiguration::allowedBiomes)
    ).apply(instance, TrackBridgeFeatureConfiguration::new);
  });

  public TagKey<Biome> allowedBiomesTag() {
    return ForgeRegistries.BIOMES.tags().createTagKey(new ResourceLocation(this.allowedBiomes.tag() ? this.allowedBiomes.toString().substring(1) : this.allowedBiomes.toString()));
  }
}