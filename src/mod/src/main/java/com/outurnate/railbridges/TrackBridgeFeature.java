package com.outurnate.railbridges;

import javax.annotation.Nonnull;

import com.outurnate.railbridges.TrackBridgeMap.Piece;

import net.minecraft.core.BlockPos;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.WorldGenRegion;
import net.minecraft.tags.TagKey;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.ChunkPos;
import net.minecraft.world.level.WorldGenLevel;
import net.minecraft.world.level.biome.Biome;
import net.minecraft.world.level.levelgen.Heightmap;
import net.minecraft.world.level.levelgen.feature.Feature;
import net.minecraft.world.level.levelgen.feature.FeaturePlaceContext;
import net.minecraft.world.level.levelgen.structure.templatesystem.StructurePlaceSettings;
import net.minecraft.world.level.levelgen.structure.templatesystem.StructureTemplate;

public class TrackBridgeFeature extends Feature<TrackBridgeFeatureConfiguration> {
  public TrackBridgeFeature() {
    super(TrackBridgeFeatureConfiguration.CODEC);
  }

  @Override
  public boolean place(@Nonnull FeaturePlaceContext<TrackBridgeFeatureConfiguration> context) {
    WorldGenLevel level = context.level();
    if (level instanceof WorldGenRegion) {
      WorldGenRegion region = (WorldGenRegion) level;
      MinecraftServer server = region.getServer();
      if (server != null) {
        TrackBridgeMap map = new TrackBridgeMap(context.config().chunkSeparation(), context.config().damageChance(), context.config().infiniteChance());
        return placeTrackPiece(server, region, map, context.config().yLevel(), context.config().allowedBiomesTag());
      }
    }
    return false;
  }

  private boolean placeTrackPiece(MinecraftServer server, WorldGenRegion region, TrackBridgeMap map, int yLevel, TagKey<Biome> biomeTag) {
    ChunkPos center = region.getCenter();
    RandomSource random = region.getRandom();
    Piece piece = map.getPiece(region.getSeed(), center, pos -> region.getBiomeManager().getBiome(pos.getMiddleBlockPosition(yLevel)).is(biomeTag));
    if (piece != null) {
      String structureName = switch (piece) {
        case EW -> "track_ew";
        case NS -> "track_ns";
        case N -> String.format("track_end_n%s", random.nextInt(0, 4));
        case S -> String.format("track_end_s%s", random.nextInt(0, 4));
        case E -> String.format("track_end_e%s", random.nextInt(0, 4));
        case W -> String.format("track_end_w%s", random.nextInt(0, 4));
        default -> "track_x";
      };
      
      StructurePlaceSettings settings = new StructurePlaceSettings();
      StructureTemplate pieceTemplate = server.getStructureManager().get(new ResourceLocation(RailBridgesMod.MODID, structureName)).get();

      BlockPos placement = center.getWorldPosition().atY(yLevel);
      pieceTemplate.placeInWorld(region, placement, placement, settings, random, 0);

      int floor = Math.min(
        Math.min(
          region.getHeightmapPos(Heightmap.Types.OCEAN_FLOOR, new BlockPos(center.getMinBlockX(), yLevel, center.getMinBlockZ())).getY(),
          region.getHeightmapPos(Heightmap.Types.OCEAN_FLOOR, new BlockPos(center.getMinBlockX(), yLevel, center.getMaxBlockZ())).getY()
        ),
        Math.min(
          region.getHeightmapPos(Heightmap.Types.OCEAN_FLOOR, new BlockPos(center.getMaxBlockX(), yLevel, center.getMinBlockZ())).getY(),
          region.getHeightmapPos(Heightmap.Types.OCEAN_FLOOR, new BlockPos(center.getMaxBlockX(), yLevel, center.getMaxBlockZ())).getY()
        )
      );

      String supportStructureName = switch (piece) {
        case EW -> "track_support_ew";
        case NS -> "track_support_ns";
        case N -> "track_support_ns";
        case S -> "track_support_ns";
        case E -> "track_support_ew";
        case W -> "track_support_ew";
        default -> "track_support_x";
      };

      StructureTemplate supportTemplate = server.getStructureManager().get(new ResourceLocation(RailBridgesMod.MODID, supportStructureName)).get();

      for (int i = floor; i < yLevel; i += supportTemplate.getSize().getY()) {
        placement = placement.atY(i);
        supportTemplate.placeInWorld(region, placement, placement, settings, random, 0);
      }

      return true;
    }
    return false;
  }
}
